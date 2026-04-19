'use server';

// Google Scholar has no public API. We parse the public profile page
// server-side. Scholar can rate-limit or gate with a captcha — we tolerate
// failure and return null so the UI degrades to the Notion fallback.

import {
	parseScholarProfile,
	type IScholarPublication,
} from './scholar-parse';

export type { IScholarPublication };

const REVALIDATE_SECONDS = 60 * 60 * 6;

export interface ScholarProfile {
	name: string;
	affiliation: string;
	totalCitations: number;
	citationsSince: number;
	hIndex: number;
	hIndexSince: number;
	publications: IScholarPublication[];
	htmlUrl: string;
}

export async function fetchScholarProfile(
	user: string,
	limit = 20
): Promise<ScholarProfile | null> {
	if (!user) return null;
	const htmlUrl = `https://scholar.google.com/citations?user=${user}&hl=en&cstart=0&pagesize=${limit}`;
	try {
		const res = await fetch(htmlUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
				'Accept-Language': 'en-US,en;q=0.9',
			},
			next: { revalidate: REVALIDATE_SECONDS },
		});
		if (!res.ok) return null;
		const parsed = parseScholarProfile(await res.text(), limit);
		if (!parsed) return null;
		return { ...parsed, htmlUrl };
	} catch {
		return null;
	}
}
