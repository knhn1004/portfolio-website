'use server';

// Resolve a paper's actual URL + a representative figure image.
//
// Strategy, in priority order (first non-null wins):
//   1. If we can infer an arXiv ID → use ar5iv (LaTeX-rendered HTML) and
//      pull the first `ltx_graphics` image. Those ARE figures from the
//      paper, not OG thumbnails or first-page screenshots.
//   2. Otherwise: fall back to og:image / twitter:image on the landing
//      page. This is usually a first-page thumbnail (ACL, MDPI) rather
//      than a real diagram, but it beats nothing.
//   3. As a last resort, first non-icon <img> on the landing page.
//
// Anything brittle here returns null and the UI drops to a [FIGURE]
// placeholder.

const REVALIDATE_SECONDS = 60 * 60 * 24; // 1 day

export interface PaperMeta {
	paperUrl: string | null;
	previewImage: string | null;
}

function extractMeta(html: string, property: string): string | null {
	const re = new RegExp(
		`<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`,
		'i'
	);
	const m = html.match(re);
	if (m) return m[1];
	const re2 = new RegExp(
		`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
		'i'
	);
	return html.match(re2)?.[1] ?? null;
}

function absolutize(url: string, base: string): string {
	try {
		return new URL(url, base).toString();
	} catch {
		return url;
	}
}

function decodeHtmlEntities(s: string): string {
	return s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

async function fetchText(url: string): Promise<string | null> {
	try {
		const res = await fetch(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
				'Accept-Language': 'en-US,en;q=0.9',
			},
			next: { revalidate: REVALIDATE_SECONDS },
		});
		if (!res.ok) return null;
		return await res.text();
	} catch {
		return null;
	}
}

function arxivIdFromUrl(url: string): string | null {
	// Matches arxiv.org/abs/2401.17244, arxiv.org/pdf/2401.17244.pdf, or
	// older IDs like cs/0102023.
	const m = url.match(
		/arxiv\.org\/(?:abs|pdf|html)\/([0-9]{4}\.[0-9]{4,5}|[a-z-]+\/[0-9]{7})/i
	);
	return m ? m[1].replace(/\.pdf$/i, '') : null;
}

async function fetchAr5ivFigure(arxivId: string): Promise<string | null> {
	const url = `https://ar5iv.labs.arxiv.org/html/${arxivId}`;
	const html = await fetchText(url);
	if (!html) return null;
	// First element with class list containing ltx_graphics. These are the
	// actual figures that the author laid out in LaTeX.
	const m = html.match(
		/<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*ltx_graphics[^"']*["']/
	);
	const alt = html.match(
		/<img[^>]+class=["'][^"']*ltx_graphics[^"']*["'][^>]*src=["']([^"']+)["']/
	);
	const src = m?.[1] || alt?.[1] || null;
	if (!src) return null;
	return absolutize(decodeHtmlEntities(src), url);
}

const ACADEMIC_HOSTS = [
	'arxiv.org',
	'openreview.net',
	'aclanthology.org',
	'acm.org',
	'ieee.org',
	'sciencedirect.com',
	'springer.com',
	'nature.com',
	'pubs.rsc.org',
	'papers.ssrn.com',
	'biorxiv.org',
	'dl.acm.org',
	'mdpi.com',
	'semanticscholar.org',
];

function isAcademicHost(href: string): boolean {
	return ACADEMIC_HOSTS.some(h => href.includes(h));
}

async function resolveFromScholar(scholarUrl: string): Promise<string | null> {
	const html = await fetchText(scholarUrl);
	if (!html) return null;
	const hrefs: string[] = [];
	const linkRe = /<a[^>]+href=["']([^"']+)["']/gi;
	for (const m of html.matchAll(linkRe)) {
		const raw = m[1];
		if (!raw) continue;
		const href = decodeHtmlEntities(raw);
		if (
			href.startsWith('#') ||
			href.startsWith('javascript:') ||
			href.startsWith('/') ||
			href.includes('scholar.google.com') ||
			href.includes('google.com/scholar')
		) {
			continue;
		}
		hrefs.push(href);
	}
	return hrefs.find(isAcademicHost) ?? hrefs[0] ?? null;
}

/**
 * Public entry: resolve URL + preview image for an arbitrary paper URL
 * (works for arxiv, Scholar detail URLs, ACL, MDPI, and plain DOIs).
 */
export async function fetchPaperMeta(
	startUrl: string
): Promise<PaperMeta> {
	if (!startUrl) return { paperUrl: null, previewImage: null };

	// If Scholar URL, resolve through it first.
	let paperUrl = startUrl;
	if (startUrl.includes('scholar.google.com/citations')) {
		const resolved = await resolveFromScholar(startUrl);
		if (!resolved) return { paperUrl: null, previewImage: null };
		paperUrl = resolved;
	}

	// 1. Real diagram via ar5iv when we have an arXiv ID.
	const arxivId = arxivIdFromUrl(paperUrl);
	if (arxivId) {
		const fig = await fetchAr5ivFigure(arxivId);
		if (fig) return { paperUrl, previewImage: fig };
	}

	// 2. og:image fallback (often a first-page thumbnail — acceptable
	//    secondary option).
	const html = await fetchText(paperUrl);
	if (!html) return { paperUrl, previewImage: null };

	const og =
		extractMeta(html, 'og:image') ||
		extractMeta(html, 'twitter:image') ||
		extractMeta(html, 'og:image:url');
	if (og) {
		const resolved = absolutize(decodeHtmlEntities(og), paperUrl);
		// Skip obvious site-chrome graphics. Substring match — these
		// artifacts don't respect word boundaries (e.g. `ieee_logo_smedia_*`).
		if (!/og\.jpg|og\.png|logo|favicon|default-|og-image/i.test(resolved)) {
			return { paperUrl, previewImage: resolved };
		}
	}

	// 3. First plausible <img>.
	const ignoreRe =
		/(icon|logo|sprite|favicon|captcha|advertisement|\.svg(?:[?"']|$))/i;
	for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
		const raw = m[1];
		if (!raw) continue;
		if (raw.startsWith('data:')) continue;
		if (ignoreRe.test(m[0])) continue;
		return {
			paperUrl,
			previewImage: absolutize(decodeHtmlEntities(raw), paperUrl),
		};
	}

	return { paperUrl, previewImage: null };
}
