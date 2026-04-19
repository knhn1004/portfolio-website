// Pure, synchronous parsing helpers — kept out of the 'use server' module
// so they can export non-async functions and be unit-tested directly.

export function parsePinnedRepoNames(html: string, user: string): string[] {
	if (!html) return [];
	const block = html.match(/js-pinned-items-reorder-list[\s\S]*?<\/ol>/)?.[0];
	if (!block) return [];
	const slugRe = new RegExp(`href="/${user}/([^"/?]+)"`, 'g');
	const names: string[] = [];
	const seen = new Set<string>();
	for (const m of block.matchAll(slugRe)) {
		const n = m[1];
		if (!seen.has(n)) {
			seen.add(n);
			names.push(n);
		}
	}
	return names;
}
