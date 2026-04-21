import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type NotionPayload = {
	verification_token?: string;
	type?: string;
	entity?: { id?: string; type?: string };
	data?: { parent?: { id?: string; type?: string } };
};

const normalizeId = (id?: string) => (id ?? '').replace(/-/g, '').toLowerCase();

function dbPathMap(): Record<string, string[]> {
	const map: Record<string, string[]> = {};
	const add = (envKey: string, paths: string[]) => {
		const id = normalizeId(process.env[envKey]);
		if (id) map[id] = paths;
	};
	add('BLOG_DATABASE_ID', ['/', '/writing']);
	add('PROJECTS_DATABASE_ID', ['/']);
	add('HONORS_DATABASE_ID', ['/']);
	add('PUBLICATIONS_DATABASE_ID', ['/']);
	return map;
}

function verifySignature(rawBody: string, header: string | null, secret: string) {
	if (!header) return false;
	const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
	const provided = header.startsWith('sha256=') ? header.slice(7) : header;
	if (provided.length !== expected.length) return false;
	try {
		return timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'));
	} catch {
		return false;
	}
}

export async function POST(req: Request) {
	const secret = process.env.NOTION_WEBHOOK_SECRET;
	const rawBody = await req.text();

	let payload: NotionPayload = {};
	try {
		payload = JSON.parse(rawBody);
	} catch {
		return NextResponse.json({ error: 'invalid json' }, { status: 400 });
	}

	// First-time setup: Notion posts a verification_token. Log it so you can
	// copy it into NOTION_WEBHOOK_SECRET. Respond 200 so Notion marks it received.
	if (payload.verification_token) {
		console.log('[notion webhook] verification_token:', payload.verification_token);
		return NextResponse.json({ ok: true });
	}

	if (!secret) {
		return NextResponse.json({ error: 'not configured' }, { status: 503 });
	}

	const signature = req.headers.get('x-notion-signature');
	if (!verifySignature(rawBody, signature, secret)) {
		return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
	}

	const parentId = normalizeId(payload.data?.parent?.id ?? payload.entity?.id);
	const map = dbPathMap();
	const paths = map[parentId];

	if (!paths) {
		return NextResponse.json({ ok: true, revalidated: [] });
	}

	for (const p of paths) revalidatePath(p);

	return NextResponse.json({ ok: true, revalidated: paths });
}
