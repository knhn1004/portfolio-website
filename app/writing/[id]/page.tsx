import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchBlogPostDetail } from '@/lib/db/notion';
import { Blocks } from '@/components/ds/notion-blocks';
import { Tag } from '@/components/ds/primitives';

export const revalidate = 3600;

function formatDate(iso: string): string {
	if (!iso) return '';
	const d = new Date(iso);
	if (!Number.isFinite(d.getTime())) return iso;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const detail = await fetchBlogPostDetail(id);
	if (!detail) return { title: 'Post' };
	return {
		title: `${detail.post.title} — Writing`,
		description: detail.post.excerpt.slice(0, 180),
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const detail = await fetchBlogPostDetail(id);
	if (!detail) notFound();

	const { post, blocks } = detail;

	return (
		<article
			style={{
				maxWidth: 680,
				margin: '0 auto',
				padding: '64px 24px 120px',
			}}
		>
			<div style={{ marginBottom: 32 }}>
				<Link
					href="/writing"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 6,
						color: 'var(--ink-3)',
						fontFamily: 'var(--font-mono)',
						fontSize: 12,
						letterSpacing: '0.08em',
						textTransform: 'uppercase',
						textDecorationLine: 'none',
					}}
				>
					<span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}>
						→
					</span>
					Back to writing
				</Link>
			</div>

			<div
				className="mono-xs"
				style={{
					marginBottom: 18,
					display: 'flex',
					gap: 12,
					alignItems: 'baseline',
				}}
			>
				<span>{formatDate(post.date)}</span>
				{post.readMinutes ? <span>· {post.readMinutes} min read</span> : null}
			</div>

			<h1
				style={{
					fontFamily: 'var(--font-display)',
					fontSize: 'clamp(40px, 6vw, 64px)',
					lineHeight: 1.05,
					letterSpacing: '-0.02em',
					color: 'var(--ink)',
					fontWeight: 400,
					margin: '0 0 16px',
				}}
			>
				{post.title}
			</h1>

			{post.excerpt && (
				<p
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 22,
						lineHeight: 1.55,
						color: 'var(--ink-3)',
						fontStyle: 'italic',
						margin: '0 0 40px',
					}}
				>
					{post.excerpt}
				</p>
			)}

			<div
				style={{
					display: 'flex',
					gap: 8,
					flexWrap: 'wrap',
					marginBottom: 32,
				}}
			>
				{post.tags.map(t => (
					<Tag key={t}>{t}</Tag>
				))}
			</div>

			<hr style={{ margin: '0 0 40px', borderTop: '1px solid var(--rule)' }} />

			<div className="prose prose--dropcap" style={{ maxWidth: 'none' }}>
				<Blocks blocks={blocks} />
			</div>
		</article>
	);
}
