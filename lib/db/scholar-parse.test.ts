import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseScholarProfile } from './scholar-parse';

const fixture = readFileSync(
	path.join(__dirname, '__fixtures__/scholar-profile.html'),
	'utf8'
);

describe('parseScholarProfile', () => {
	it('returns null for empty input', () => {
		expect(parseScholarProfile('')).toBeNull();
	});

	it('parses the profile metadata', () => {
		const p = parseScholarProfile(fixture);
		expect(p).not.toBeNull();
		expect(p!.name.length).toBeGreaterThan(0);
		expect(p!.totalCitations).toBeGreaterThanOrEqual(p!.citationsSince);
		expect(p!.hIndex).toBeGreaterThanOrEqual(0);
	});

	it('parses publication rows', () => {
		const p = parseScholarProfile(fixture);
		expect(p!.publications.length).toBeGreaterThan(0);
		for (const pub of p!.publications) {
			expect(pub.title.length).toBeGreaterThan(0);
			expect(pub.url).toMatch(/^https:\/\/scholar\.google\.com\//);
			expect(Number.isFinite(pub.citations)).toBe(true);
		}
	});

	it('respects the limit argument', () => {
		const p = parseScholarProfile(fixture, 1);
		expect(p!.publications.length).toBeLessThanOrEqual(1);
	});
});
