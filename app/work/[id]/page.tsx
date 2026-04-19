import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchProjectDetail } from '@/lib/db/notion';
import { Blocks } from '@/components/ds/notion-blocks';
import { Icon, Tag } from '@/components/ds/primitives';

export const revalidate = 3600;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const detail = await fetchProjectDetail(id);
	if (!detail) return { title: 'Project' };
	return {
		title: `${detail.project.name} — Project`,
		description: detail.project.description.slice(0, 180),
	};
}

export default async function ProjectDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const detail = await fetchProjectDetail(id);
	if (!detail) notFound();

	const { project, blocks } = detail;

	return (
		<article
			style={{
				maxWidth: 920,
				margin: '0 auto',
				padding: '64px 24px 120px',
			}}
		>
			<div style={{ marginBottom: 32 }}>
				<Link
					href="/#work"
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
					Back to work
				</Link>
			</div>

			<div className="eyebrow" style={{ marginBottom: 18 }}>
				§— Project
			</div>
			<h1
				style={{
					fontFamily: 'var(--font-display)',
					fontSize: 'clamp(40px, 6vw, 64px)',
					lineHeight: 1.05,
					letterSpacing: '-0.02em',
					color: 'var(--ink)',
					fontWeight: 400,
					margin: '0 0 24px',
				}}
			>
				{project.name}
			</h1>

			<div
				style={{
					display: 'flex',
					gap: 8,
					flexWrap: 'wrap',
					marginBottom: 40,
					alignItems: 'center',
				}}
			>
				{project.tags.map(t => (
					<Tag key={t}>{t}</Tag>
				))}
				{project.link && (
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							marginLeft: 'auto',
							color: 'var(--ink)',
							textDecorationLine: 'underline',
							textDecorationColor: 'var(--accent)',
							textUnderlineOffset: 3,
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
						}}
					>
						Visit project <Icon name="arrowUpRight" size={14} />
					</a>
				)}
			</div>

			{blocks.length > 0 ? (
				<Blocks blocks={blocks} />
			) : (
				<p
					className="lead"
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 21,
						lineHeight: 1.55,
						color: 'var(--ink-2)',
						fontStyle: 'italic',
					}}
				>
					{project.description}
				</p>
			)}
		</article>
	);
}
