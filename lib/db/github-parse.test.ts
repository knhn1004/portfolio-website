import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parsePinnedRepoNames } from './github-parse';

const fixture = readFileSync(
	path.join(__dirname, '__fixtures__/github-pinned.html'),
	'utf8'
);

describe('parsePinnedRepoNames', () => {
	it('extracts repo slugs in profile order, deduped', () => {
		const names = parsePinnedRepoNames(fixture, 'knhn1004');
		expect(names.length).toBeGreaterThan(0);
		expect(names.length).toBeLessThanOrEqual(6); // GitHub caps pinned at 6
		// Known slugs from the captured profile at fixture time.
		expect(names).toContain('caesar');
		expect(names).toContain('portfolio-website');
		// No duplicates.
		expect(new Set(names).size).toBe(names.length);
	});

	it('returns [] when HTML lacks the pinned list', () => {
		expect(parsePinnedRepoNames('<html><body>no pins</body></html>', 'x')).toEqual([]);
	});

	it('returns [] for empty input', () => {
		expect(parsePinnedRepoNames('', 'anyone')).toEqual([]);
	});

	it('ignores hrefs outside the pinned block', () => {
		const html = `
			<a href="/someone/pre-list-repo">pre</a>
			<ol class="js-pinned-items-reorder-list">
				<li><a href="/someone/inside-a">a</a></li>
				<li><a href="/someone/inside-b">b</a></li>
			</ol>
			<a href="/someone/post-list-repo">post</a>
		`;
		expect(parsePinnedRepoNames(html, 'someone')).toEqual([
			'inside-a',
			'inside-b',
		]);
	});

	it('scopes by user so other user links are ignored', () => {
		const html = `
			<ol class="js-pinned-items-reorder-list">
				<li><a href="/alice/repo-1">a</a></li>
				<li><a href="/bob/repo-2">b</a></li>
			</ol>
		`;
		expect(parsePinnedRepoNames(html, 'alice')).toEqual(['repo-1']);
	});
});
