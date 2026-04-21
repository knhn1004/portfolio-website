import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const revalidatePath = vi.fn();
vi.mock('next/cache', () => ({
	revalidatePath: (p: string) => revalidatePath(p),
}));

const IMPORT_PATH = './route';

const TEST_SECRET = 'notion-test-secret';
const BLOG_ID = '11111111111111111111111111111111';
const UNKNOWN_ID = '99999999999999999999999999999999';

const sign = (body: string, secret = TEST_SECRET) =>
	'sha256=' + createHmac('sha256', secret).update(body).digest('hex');

const post = async (
	body: string,
	init: { signature?: string | null; skipSig?: boolean } = {}
) => {
	const mod = await import(IMPORT_PATH);
	const headers = new Headers();
	if (!init.skipSig) {
		headers.set('x-notion-signature', init.signature ?? sign(body));
	}
	const req = new Request('http://local/api/revalidate/notion', {
		method: 'POST',
		body,
		headers,
	});
	return mod.POST(req);
};

beforeEach(() => {
	vi.resetModules();
	revalidatePath.mockReset();
	process.env.NOTION_WEBHOOK_SECRET = TEST_SECRET;
	// Hyphenated form to verify normalizeId stripping.
	process.env.BLOG_DATABASE_ID = '11111111-1111-1111-1111-111111111111';
	delete process.env.PROJECTS_DATABASE_ID;
	delete process.env.HONORS_DATABASE_ID;
	delete process.env.PUBLICATIONS_DATABASE_ID;
});

afterEach(() => {
	delete process.env.NOTION_WEBHOOK_SECRET;
	delete process.env.BLOG_DATABASE_ID;
});

describe('notion revalidate webhook', () => {
	it('rejects invalid JSON body', async () => {
		const res = await post('not-json', { skipSig: true });
		expect(res.status).toBe(400);
	});

	it('returns 200 and logs verification_token on initial handshake', async () => {
		const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const body = JSON.stringify({ verification_token: 'abc-token-123' });
		const res = await post(body, { skipSig: true });
		expect(res.status).toBe(200);
		expect(logSpy).toHaveBeenCalledWith(
			expect.stringContaining('verification_token'),
			'abc-token-123'
		);
		logSpy.mockRestore();
	});

	it('returns 503 if secret not configured', async () => {
		delete process.env.NOTION_WEBHOOK_SECRET;
		const body = JSON.stringify({ type: 'page.updated' });
		const res = await post(body, { skipSig: true });
		expect(res.status).toBe(503);
	});

	it('rejects missing signature', async () => {
		const body = JSON.stringify({ type: 'page.updated' });
		const res = await post(body, { skipSig: true });
		expect(res.status).toBe(401);
		expect(revalidatePath).not.toHaveBeenCalled();
	});

	it('rejects bad signature', async () => {
		const body = JSON.stringify({ type: 'page.updated' });
		const res = await post(body, { signature: 'sha256=' + '0'.repeat(64) });
		expect(res.status).toBe(401);
		expect(revalidatePath).not.toHaveBeenCalled();
	});

	it('rejects signature computed with wrong secret', async () => {
		const body = JSON.stringify({ type: 'page.updated' });
		const res = await post(body, { signature: sign(body, 'wrong-secret') });
		expect(res.status).toBe(401);
	});

	it('revalidates / and /writing on Blog DB event', async () => {
		const body = JSON.stringify({
			type: 'page.updated',
			data: { parent: { id: BLOG_ID, type: 'database' } },
		});
		const res = await post(body);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.revalidated).toEqual(['/', '/writing']);
		expect(revalidatePath).toHaveBeenCalledWith('/');
		expect(revalidatePath).toHaveBeenCalledWith('/writing');
	});

	it('ignores unknown database IDs without calling revalidate', async () => {
		const body = JSON.stringify({
			type: 'page.updated',
			data: { parent: { id: UNKNOWN_ID, type: 'database' } },
		});
		const res = await post(body);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.revalidated).toEqual([]);
		expect(revalidatePath).not.toHaveBeenCalled();
	});
});
