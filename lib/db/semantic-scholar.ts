'use server';

// Semantic Scholar has a free public API that's far more reliable than
// scraping Google Scholar. We resolve the author once, then list papers.
// Author ID can be set explicitly via NEXT_PUBLIC_SEMANTIC_SCHOLAR_AUTHOR;
// otherwise we search by name and take the author whose most-recent paper
// is newest (prevents colliding with same-name academics in other fields).

const REVALIDATE_SECONDS = 60 * 60 * 6;
const API = 'https://api.semanticscholar.org/graph/v1';

export interface SemanticPaper {
	id: string;
	title: string;
	year: string;
	authors: string;
	venue: string;
	url: string;
	doi: string;
	arxivId: string;
}

async function j<T>(url: string): Promise<T | null> {
	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'oliverchou-web/1.0' },
			next: { revalidate: REVALIDATE_SECONDS },
		});
		if (!res.ok) return null;
		return (await res.json()) as T;
	} catch {
		return null;
	}
}

async function resolveAuthorId(
	nameOrId: string
): Promise<string | null> {
	if (/^\d+$/.test(nameOrId)) return nameOrId;
	const data = await j<{
		data: Array<{ authorId: string; name: string }>;
	}>(
		`${API}/author/search?query=${encodeURIComponent(nameOrId)}&limit=10`
	);
	if (!data?.data?.length) return null;

	// Fetch most-recent paper year for each candidate; pick the most recent
	// one. Works for disambiguating same-name researchers.
	const candidates = await Promise.all(
		data.data.slice(0, 5).map(async a => {
			const papers = await j<{
				data: Array<{ year: number | null }>;
			}>(
				`${API}/author/${a.authorId}/papers?fields=year&limit=5&sort=year:desc`
			);
			const newest = papers?.data?.[0]?.year ?? 0;
			return { id: a.authorId, newest };
		})
	);
	candidates.sort((a, b) => b.newest - a.newest);
	return candidates[0]?.id ?? null;
}

export async function fetchSemanticScholarPapers(
	nameOrId: string,
	limit = 20
): Promise<SemanticPaper[]> {
	if (!nameOrId) return [];
	const id = await resolveAuthorId(nameOrId);
	if (!id) return [];

	const data = await j<{
		data: Array<any>;
	}>(
		`${API}/author/${id}/papers?fields=title,year,venue,externalIds,openAccessPdf,url,authors&limit=${limit}&sort=year:desc`
	);
	if (!data?.data?.length) return [];

	return data.data.map(p => {
		const doi = p.externalIds?.DOI || '';
		const arxivId = p.externalIds?.ArXiv || '';
		const url =
			p.openAccessPdf?.url ||
			(arxivId ? `https://arxiv.org/abs/${arxivId}` : '') ||
			(doi ? `https://doi.org/${doi}` : '') ||
			p.url ||
			'';
		const authors = (p.authors || []).map((a: any) => a.name).join(', ');
		return {
			id: p.paperId || url,
			title: p.title || '',
			year: p.year ? String(p.year) : '',
			authors,
			venue: p.venue || '',
			url,
			doi,
			arxivId,
		};
	});
}
