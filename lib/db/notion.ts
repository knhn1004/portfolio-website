'use server';
import { Client, LogLevel } from '@notionhq/client';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import type { IProject } from '@/lib/models/project';
import type { IHonor } from '@/lib/models/honor';
import type { IPublication } from '@/lib/models/publication';
import type { IQuestionRequest } from '@/lib/models/questionRequest';
import type { IBlogPost } from '@/lib/models/blogPost';

function client() {
	return new Client({
		auth: process.env.NOTION_TOKEN,
		logLevel:
			process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.ERROR,
	});
}

function richText(prop: any): string {
	return prop?.rich_text?.[0]?.plain_text ?? '';
}
function title(prop: any): string {
	return prop?.title?.[0]?.plain_text ?? '';
}
/**
 * Notion databases always have exactly one title column, but the column
 * NAME varies: new DBs default to "Name", older ones often use "title".
 * Pulling the title by property type avoids baking that choice into the
 * fetcher.
 */
function titleByType(properties: Record<string, any>): string {
	for (const v of Object.values(properties)) {
		if ((v as any)?.type === 'title') return title(v);
	}
	return '';
}
function url(prop: any): string {
	return prop?.url ?? '';
}
function fileUrl(prop: any): string {
	const f = prop?.files?.[0];
	return f?.file?.url ?? f?.external?.url ?? '';
}
function multiSelect(prop: any): string[] {
	return (prop?.multi_select ?? []).map((t: any) => t.name as string);
}
function number(prop: any): number | null {
	return typeof prop?.number === 'number' ? prop.number : null;
}
function dateStart(prop: any): string {
	return prop?.date?.start ?? '';
}

export async function fetchProjects(): Promise<IProject[]> {
	const dbId = process.env.PROJECTS_DATABASE_ID;
	if (!dbId) return [];
	try {
		const { results } = await client().databases.query({
			database_id: dbId,
			filter: { property: 'show', checkbox: { equals: true } },
		});
		return results.map(p => {
			const props = (p as any).properties;
			return {
				id: p.id,
				name: title(props.Name),
				description: richText(props.Description),
				thumbnail:
					fileUrl(props.images) ||
					'https://placehold.co/600x400/14110D/EFEAE0/png',
				link: url(props.URL),
				tags: multiSelect(props.Tags),
			};
		});
	} catch {
		return [];
	}
}

export async function fetchHonors(): Promise<IHonor[]> {
	const dbId = process.env.HONORS_DATABASE_ID;
	if (!dbId) return [];
	try {
		const { results } = await client().databases.query({
			database_id: dbId,
			filter: { property: 'show', checkbox: { equals: true } },
		});
		return results.map(h => {
			const props = (h as any).properties;
			return {
				id: h.id,
				title: title(props.title),
				date: richText(props.date),
				issuedBy: richText(props.issuedBy),
			};
		});
	} catch {
		return [];
	}
}

export async function fetchPublications(): Promise<IPublication[]> {
	const dbId = process.env.PUBLICATIONS_DATABASE_ID;
	if (!dbId) return [];
	try {
		const { results } = await client().databases.query({ database_id: dbId });
		return results.map(p => {
			const props = (p as any).properties;
			return {
				id: p.id,
				title: title(props.title),
				date: dateStart(props.date),
				image: fileUrl(props.images),
				url: url(props.url),
				tags: multiSelect(props.tags),
			};
		});
	} catch {
		return [];
	}
}

/**
 * Blog post fetcher — expects a Notion database with:
 *   title (title), slug (rich_text), date (date), excerpt (rich_text),
 *   url (url), cover (files), tags (multi_select), readMinutes (number),
 *   show (checkbox)
 * Returns [] if BLOG_DATABASE_ID is unset — lets the section hide gracefully
 * until the user shares a real database with the integration.
 */
export async function fetchBlogPosts(): Promise<IBlogPost[]> {
	const dbId = process.env.BLOG_DATABASE_ID;
	if (!dbId) return [];
	try {
		const { results } = await client().databases.query({
			database_id: dbId,
			filter: { property: 'show', checkbox: { equals: true } },
			sorts: [{ property: 'date', direction: 'descending' }],
		});
		return results.map(p => {
			const props = (p as any).properties;
			return {
				id: p.id,
				title: titleByType(props),
				slug: richText(props.slug),
				date: dateStart(props.date),
				excerpt: richText(props.excerpt),
				url: url(props.url),
				cover: fileUrl(props.cover),
				tags: multiSelect(props.tags),
				readMinutes: number(props.readMinutes),
			};
		});
	} catch {
		return [];
	}
}

export interface INotionBlock {
	id: string;
	type: string;
	// Raw Notion block payload (`paragraph`, `heading_1`, etc.). We keep the
	// whole shape because the client-side renderer needs it. Type is `any`
	// because the Notion SDK types are enormous.
	data: any;
	children: INotionBlock[];
}

async function fetchBlockTree(blockId: string): Promise<INotionBlock[]> {
	const notion = client();
	const results: INotionBlock[] = [];
	let cursor: string | undefined;
	do {
		const page: any = await notion.blocks.children.list({
			block_id: blockId,
			start_cursor: cursor,
			page_size: 100,
		});
		for (const b of page.results) {
			const block: INotionBlock = {
				id: b.id,
				type: b.type,
				data: (b as any)[b.type] ?? {},
				children: [],
			};
			if (b.has_children) {
				block.children = await fetchBlockTree(b.id);
			}
			results.push(block);
		}
		cursor = page.has_more ? page.next_cursor : undefined;
	} while (cursor);
	return results;
}

export interface IProjectDetail {
	project: IProject;
	blocks: INotionBlock[];
}

export async function fetchProjectDetail(
	id: string
): Promise<IProjectDetail | null> {
	try {
		const notion = client();
		const page: any = await notion.pages.retrieve({ page_id: id });
		const props = page.properties;
		const project: IProject = {
			id: page.id,
			name: title(props.Name),
			description: richText(props.Description),
			thumbnail:
				fileUrl(props.images) ||
				'https://placehold.co/600x400/14110D/EFEAE0/png',
			link: url(props.URL),
			tags: multiSelect(props.Tags),
		};
		const blocks = await fetchBlockTree(id);
		return { project, blocks };
	} catch {
		return null;
	}
}

export interface IBlogPostDetail {
	post: IBlogPost;
	blocks: INotionBlock[];
}

export async function fetchBlogPostDetail(
	id: string
): Promise<IBlogPostDetail | null> {
	try {
		const notion = client();
		const page: any = await notion.pages.retrieve({ page_id: id });
		const props = page.properties;
		const post: IBlogPost = {
			id: page.id,
			title: title(props.title),
			slug: richText(props.slug),
			date: dateStart(props.date),
			excerpt: richText(props.excerpt),
			url: url(props.url),
			cover: fileUrl(props.cover),
			tags: multiSelect(props.tags),
			readMinutes: number(props.readMinutes),
		};
		const blocks = await fetchBlockTree(id);
		return { post, blocks };
	} catch {
		return null;
	}
}

export type QuestionFormResult =
	| { ok: true }
	| { ok: false; reason: 'invalid' | 'recaptcha' | 'rate_limited' | 'error' };

// Per-fingerprint limits (IP + UA hash — can be stale through VPN/NAT but
// catches the naive repeat-submit case without needing external storage).
const LIMIT_PER_FP_HOUR = 2;
const LIMIT_PER_FP_DAY = 5;
// Global limits — the ceiling in case of coordinated spam from many IPs.
const LIMIT_GLOBAL_DAY = 20;
const LIMIT_GLOBAL_WEEK = 80;

async function fingerprintFromHeaders(): Promise<string> {
	const h = await headers();
	const ip =
		h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		h.get('x-real-ip') ||
		h.get('cf-connecting-ip') ||
		'unknown';
	const ua = h.get('user-agent') || 'unknown';
	return createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 16);
}

async function checkRateLimit(fingerprint: string): Promise<boolean> {
	const dbId = process.env.QUESTION_FORM_DATABASE_ID;
	if (!dbId) return true;
	const now = Date.now();
	const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
	const { results } = await client().databases.query({
		database_id: dbId,
		filter: {
			property: 'submittedAt',
			date: { on_or_after: weekAgo },
		},
		page_size: 100,
	});
	const hourAgo = now - 60 * 60 * 1000;
	const dayAgo = now - 24 * 60 * 60 * 1000;
	let fpHour = 0;
	let fpDay = 0;
	let globalDay = 0;
	const globalWeek = results.length;
	for (const p of results) {
		const props = (p as any).properties;
		const ts = new Date(props.submittedAt?.date?.start || 0).getTime();
		const fp = props.fingerprint?.rich_text?.[0]?.plain_text || '';
		if (ts >= dayAgo) {
			globalDay++;
			if (fp === fingerprint) fpDay++;
		}
		if (ts >= hourAgo && fp === fingerprint) fpHour++;
	}
	if (fpHour >= LIMIT_PER_FP_HOUR) return false;
	if (fpDay >= LIMIT_PER_FP_DAY) return false;
	if (globalDay >= LIMIT_GLOBAL_DAY) return false;
	if (globalWeek >= LIMIT_GLOBAL_WEEK) return false;
	return true;
}

export async function handleQuestionForm(
	req: IQuestionRequest
): Promise<QuestionFormResult> {
	if (!req.token) return { ok: false, reason: 'recaptcha' };

	for (const key of ['firstName', 'lastName', 'organization', 'email', 'question']) {
		if (!req[key] || req[key] === '') return { ok: false, reason: 'invalid' };
	}

	const verifyUrl = new URL('https://www.google.com/recaptcha/api/siteverify');
	verifyUrl.searchParams.append('secret', process.env.RECAPTCHA_SECRET_KEY || '');
	verifyUrl.searchParams.append('response', req.token);
	const response = await fetch(verifyUrl.toString());
	if (!response.ok) return { ok: false, reason: 'recaptcha' };
	const verify = (await response.json()) as { success: boolean; score?: number };
	if (!verify.success || (typeof verify.score === 'number' && verify.score < 0.5)) {
		return { ok: false, reason: 'recaptcha' };
	}

	const fingerprint = await fingerprintFromHeaders();
	try {
		const allowed = await checkRateLimit(fingerprint);
		if (!allowed) return { ok: false, reason: 'rate_limited' };
	} catch {
		// If the rate-limit check itself fails (network, schema drift),
		// fall through and allow the submission — better to accept a
		// message than to silently swallow a legitimate one.
	}

	try {
		await client().pages.create({
			parent: { database_id: process.env.QUESTION_FORM_DATABASE_ID || '' },
			properties: {
				firstName: {
					title: [{ type: 'text', text: { content: req.firstName } }],
				},
				lastName: {
					rich_text: [{ type: 'text', text: { content: req.lastName } }],
				},
				organization: {
					rich_text: [{ type: 'text', text: { content: req.organization } }],
				},
				email: { email: req.email },
				question: {
					rich_text: [{ type: 'text', text: { content: req.question } }],
				},
				fingerprint: {
					rich_text: [{ type: 'text', text: { content: fingerprint } }],
				},
				submittedAt: { date: { start: new Date().toISOString() } },
			},
		});
		return { ok: true };
	} catch {
		return { ok: false, reason: 'error' };
	}
}
