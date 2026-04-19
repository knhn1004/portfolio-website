#!/usr/bin/env node
/**
 * Sync honors / awards into the Notion Honors database.
 *
 * LinkedIn blocks unauthenticated scraping (HTTP 999 authwall) and the
 * LinkedIn API doesn't expose honors, so the source-of-truth is a JSON
 * file you paste/update by hand, kept in `data/honors.json`.
 *
 * Usage:
 *   1. Edit data/honors.json (array of { title, date, issuedBy, show }).
 *   2. `pnpm honors:sync`
 *
 * Idempotent: existing rows are matched by (title + date) and updated in
 * place. New titles are created. Rows you removed from JSON are NOT
 * deleted — remove them in Notion if you want them gone.
 */

import { Client } from '@notionhq/client';
import { readFileSync, existsSync } from 'node:fs';

function loadDotEnv(path) {
	if (!existsSync(path)) return {};
	return Object.fromEntries(
		readFileSync(path, 'utf8')
			.split('\n')
			.filter(l => l.includes('=') && !l.trim().startsWith('#'))
			.map(l => {
				const [k, ...v] = l.split('=');
				return [k.trim(), v.join('=').trim().replace(/^"|"$/g, '')];
			})
	);
}

const env = { ...loadDotEnv('.env.local'), ...process.env };
if (!env.NOTION_TOKEN) {
	console.error('Missing NOTION_TOKEN in .env.local');
	process.exit(1);
}
if (!env.HONORS_DATABASE_ID) {
	console.error('Missing HONORS_DATABASE_ID in .env.local');
	process.exit(1);
}

const SOURCE = 'data/honors.json';
if (!existsSync(SOURCE)) {
	console.error(`Source not found: ${SOURCE}`);
	console.error(
		'Create it with an array like:\n  [{"title":"X","date":"Jun 2024","issuedBy":"Y","show":true}]'
	);
	process.exit(1);
}
const input = JSON.parse(readFileSync(SOURCE, 'utf8'));
if (!Array.isArray(input)) {
	console.error(`${SOURCE} must contain an array.`);
	process.exit(1);
}

const notion = new Client({ auth: env.NOTION_TOKEN });

function rt(text) {
	return [{ type: 'text', text: { content: text || '' } }];
}

function norm(s) {
	return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function keyOf(title, date) {
	return `${norm(title)}|${norm(date)}`;
}

async function main() {
	const { results: existingRows } = await notion.databases.query({
		database_id: env.HONORS_DATABASE_ID,
		page_size: 100,
	});
	const byKey = new Map();
	for (const r of existingRows) {
		const p = r.properties;
		const title = p.title?.title?.[0]?.plain_text || '';
		const date = p.date?.rich_text?.[0]?.plain_text || '';
		byKey.set(keyOf(title, date), r.id);
	}

	let created = 0;
	let updated = 0;
	for (const h of input) {
		if (!h.title) continue;
		const properties = {
			title: { title: rt(h.title) },
			date: { rich_text: rt(h.date || '') },
			issuedBy: { rich_text: rt(h.issuedBy || '') },
			show: { checkbox: h.show !== false },
		};
		const key = keyOf(h.title, h.date || '');
		const match = byKey.get(key);
		if (match) {
			await notion.pages.update({ page_id: match, properties });
			updated++;
		} else {
			await notion.pages.create({
				parent: { database_id: env.HONORS_DATABASE_ID },
				properties,
			});
			created++;
		}
	}

	console.log(
		`✓ Sync complete — created ${created}, updated ${updated}, total in file ${input.length}`
	);
}

main().catch(e => {
	console.error('Error:', e.message);
	process.exit(1);
});
