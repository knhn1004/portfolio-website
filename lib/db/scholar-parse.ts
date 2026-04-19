// Pure parsing for Google Scholar HTML. Kept out of the 'use server' module
// so tests can import it without a Next.js context.

export interface IScholarPublication {
	title: string;
	authors: string;
	venue: string;
	year: string;
	citations: number;
	url: string;
}

export interface ParsedScholar {
	name: string;
	affiliation: string;
	totalCitations: number;
	citationsSince: number;
	hIndex: number;
	hIndexSince: number;
	publications: IScholarPublication[];
}

function decodeEntities(s: string): string {
	return s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ');
}

function num(s: string | undefined): number {
	const n = parseInt((s || '').replace(/[^\d-]/g, ''), 10);
	return Number.isFinite(n) ? n : 0;
}

export function parseScholarProfile(
	html: string,
	limit = 20
): ParsedScholar | null {
	if (!html) return null;

	const name = decodeEntities(
		html.match(/<div id="gsc_prf_in">([^<]+)<\/div>/)?.[1] || ''
	);
	const affiliation = decodeEntities(
		html.match(/<div class="gsc_prf_il">([^<]+)<\/div>/)?.[1] || ''
	);

	const stats = [...html.matchAll(/<td class="gsc_rsb_std">(\d+)<\/td>/g)].map(
		m => num(m[1])
	);
	const [totalCitations = 0, citationsSince = 0, hIndex = 0, hIndexSince = 0] =
		stats;

	const pubs: IScholarPublication[] = [];
	const rowRe =
		/<tr class="gsc_a_tr">[\s\S]*?<a href="([^"]+)" class="gsc_a_at">([^<]+)<\/a>[\s\S]*?<div class="gs_gray">([^<]*)<\/div>\s*<div class="gs_gray">([^<]*)(?:<span[\s\S]*?)?<\/div>[\s\S]*?<a[^>]*class="gsc_a_ac[^"]*"[^>]*>([^<]*)<\/a>[\s\S]*?<span class="gsc_a_h[^"]*">([^<]*)<\/span>/g;
	for (const m of html.matchAll(rowRe)) {
		const [, , rawTitle, rawAuthors, rawVenue, citeText, rawYear] = m;
		const path = decodeEntities(m[1] || '');
		pubs.push({
			title: decodeEntities(rawTitle),
			authors: decodeEntities(rawAuthors),
			venue: decodeEntities(rawVenue.replace(/<[^>]+>/g, '').trim()),
			year: rawYear.trim(),
			citations: num(citeText),
			url: path.startsWith('http')
				? path
				: `https://scholar.google.com${path}`,
		});
		if (pubs.length >= limit) break;
	}

	return {
		name,
		affiliation,
		totalCitations,
		citationsSince,
		hIndex,
		hIndexSince,
		publications: pubs,
	};
}
