#!/usr/bin/env node
/**
 * Set up the Question Form Notion database for the portfolio site.
 *
 * Flow:
 *   1. If QUESTION_FORM_DATABASE_ID is set in .env.local, try to retrieve it
 *      and update its schema to match what the site expects. Safe to re-run.
 *   2. Otherwise, search the integration's visible databases for one named
 *      "Question Form". If found, treat as (1).
 *   3. Otherwise, create a new inline DB under the Portfolio parent page.
 *      Requires the integration to have access to that parent page.
 *
 * Required env:
 *   NOTION_TOKEN                — integration token (read from .env.local)
 * Optional env:
 *   QUESTION_FORM_DATABASE_ID   — target DB (any casing; hyphens allowed)
 *   NOTION_PARENT_PAGE_ID       — Portfolio page ID (default set below)
 */

import { Client } from '@notionhq/client';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DEFAULT_PARENT = 'adac6b1f-c400-4fac-ad23-6d66a25aa447';
const DB_TITLE = 'Question Form';

const EXPECTED_PROPERTIES = {
	firstName: { title: {} },
	lastName: { rich_text: {} },
	organization: { rich_text: {} },
	email: { email: {} },
	question: { rich_text: {} },
	fingerprint: { rich_text: {} },
	submittedAt: { date: {} },
};

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
const token = env.NOTION_TOKEN;
const parentPageId = env.NOTION_PARENT_PAGE_ID || DEFAULT_PARENT;

if (!token) {
	console.error('Missing NOTION_TOKEN in .env.local or environment.');
	process.exit(1);
}

const notion = new Client({ auth: token });

function shareInstructions(dbId) {
	console.error('');
	console.error('The integration does not have access to this database.');
	console.error('');
	console.error('Fix (one time):');
	console.error(`  1. Open the ${DB_TITLE} database in Notion.`);
	console.error(
		'  2. Top-right "…" → Connections → search "Portfolio Website" → add.'
	);
	console.error('  3. Re-run: pnpm form:setup');
	if (dbId) {
		console.error('');
		console.error('Or set QUESTION_FORM_DATABASE_ID manually in .env.local:');
		console.error(`  QUESTION_FORM_DATABASE_ID=${dbId}`);
	}
}

function propsToAdd(existing) {
	const additions = {};
	for (const [k, schema] of Object.entries(EXPECTED_PROPERTIES)) {
		if (k === 'firstName') {
			const hasTitle = Object.values(existing).some(p => p.type === 'title');
			if (!hasTitle) additions.firstName = schema;
			continue;
		}
		if (!existing[k]) additions[k] = schema;
	}
	return additions;
}

async function updateSchema(dbId) {
	const db = await notion.databases.retrieve({ database_id: dbId });
	const existing = db.properties;
	const additions = propsToAdd(existing);
	if (Object.keys(additions).length === 0) {
		console.log('✓ Schema already complete.');
		return db;
	}
	console.log(
		'Adding missing properties:',
		Object.keys(additions).join(', ')
	);
	return await notion.databases.update({
		database_id: dbId,
		properties: additions,
	});
}

async function findExistingDb() {
	const s = await notion.search({
		query: DB_TITLE,
		filter: { property: 'object', value: 'database' },
		page_size: 30,
	});
	const match = s.results.find(
		d => d.title?.map(t => t.plain_text).join('').trim() === DB_TITLE
	);
	return match?.id || null;
}

async function main() {
	let dbId = env.QUESTION_FORM_DATABASE_ID || null;

	if (dbId) {
		console.log(`Target DB (from env): ${dbId}`);
		try {
			await updateSchema(dbId);
			await writeEnvVar('QUESTION_FORM_DATABASE_ID', dbId);
			console.log('');
			console.log('✓ Question Form DB ready.');
			console.log('The contact form on /#contact writes here when submitted.');
			return;
		} catch (e) {
			if (
				e.code === 'object_not_found' ||
				/Could not find|unauthorized/i.test(e.message)
			) {
				console.error(`✗ ${e.message}`);
				shareInstructions(dbId);
				process.exit(2);
			}
			throw e;
		}
	}

	console.log(`Searching integration for an existing "${DB_TITLE}" database…`);
	dbId = await findExistingDb();
	if (dbId) {
		console.log(`Found existing DB: ${dbId}`);
		await updateSchema(dbId);
		await writeEnvVar('QUESTION_FORM_DATABASE_ID', dbId);
		console.log('✓ Schema synced and QUESTION_FORM_DATABASE_ID written.');
		return;
	}

	console.log('No existing DB found. Attempting to create under parent…');
	try {
		const created = await notion.databases.create({
			parent: { type: 'page_id', page_id: parentPageId },
			title: [{ type: 'text', text: { content: DB_TITLE } }],
			is_inline: true,
			properties: EXPECTED_PROPERTIES,
		});
		console.log(`✓ Created ${DB_TITLE} DB: ${created.id}`);
		await writeEnvVar('QUESTION_FORM_DATABASE_ID', created.id);
	} catch (e) {
		if (
			e.code === 'object_not_found' ||
			/Could not find|unauthorized/i.test(e.message)
		) {
			console.error(`✗ ${e.message}`);
			shareInstructions();
			process.exit(2);
		}
		throw e;
	}
}

async function writeEnvVar(key, value) {
	const path = '.env.local';
	if (!existsSync(path)) {
		writeFileSync(path, `${key}=${value}\n`);
		console.log(`wrote new ${path}`);
		return;
	}
	const current = readFileSync(path, 'utf8');
	if (new RegExp(`^${key}=`, 'm').test(current)) {
		const next = current.replace(
			new RegExp(`^${key}=.*$`, 'm'),
			`${key}=${value}`
		);
		if (next !== current) {
			writeFileSync(path, next);
			console.log(`updated ${key} in ${path}`);
		}
		return;
	}
	writeFileSync(path, current + `\n${key}=${value}\n`);
	console.log(`appended ${key} to ${path}`);
}

main().catch(e => {
	console.error('Unexpected error:', e.message);
	process.exit(1);
});
