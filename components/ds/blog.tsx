'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { IBlogPost } from '@/lib/models/blogPost';
import { Tag } from './primitives';
import { Pager } from './projects';

function formatDate(iso: string): string {
	if (!iso) return '';
	const d = new Date(iso);
	if (!Number.isFinite(d.getTime())) return iso;
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	});
}

function BlogRow({ p, last }: { p: IBlogPost; last: boolean }) {
	const [hover, setHover] = useState(false);
	const href = `/writing/${p.id}`;
	return (
		<Link
			href={href}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="oc-blog-row"
			style={{
				display: 'grid',
				gridTemplateColumns: '160px 1fr 220px',
				gap: 24,
				alignItems: 'baseline',
				padding: '28px 8px',
				borderBottom: last ? 'none' : '1px solid var(--rule-soft)',
				cursor: 'pointer',
				transition: 'background 120ms var(--ease-out)',
				background: hover ? 'var(--paper-2)' : 'transparent',
				textDecoration: 'none',
				color: 'inherit',
			}}
		>
			<div>
				<div className="mono-xs">{formatDate(p.date)}</div>
				{p.readMinutes ? (
					<div className="mono-xs" style={{ marginTop: 4 }}>
						· {p.readMinutes} min read
					</div>
				) : null}
			</div>
			<div>
				<div
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 24,
						lineHeight: 1.25,
						color: 'var(--ink)',
						letterSpacing: '-0.01em',
						marginBottom: 8,
						textDecorationLine: hover ? 'underline' : 'none',
						textDecorationColor: 'var(--accent)',
						textUnderlineOffset: 4,
					}}
				>
					{p.title}
				</div>
				{p.excerpt && (
					<div className="body-sm" style={{ maxWidth: 680 }}>
						{p.excerpt}
					</div>
				)}
			</div>
			<div
				style={{
					display: 'flex',
					gap: 6,
					justifyContent: 'flex-end',
					flexWrap: 'wrap',
				}}
			>
				{p.tags.map(t => (
					<Tag key={t}>{t}</Tag>
				))}
			</div>
		</Link>
	);
}

const SAMPLE_POSTS: Array<{
	date: string;
	readMinutes: number;
	title: string;
	excerpt: string;
	tags: string[];
}> = [
	{
		date: 'Coming soon',
		readMinutes: 6,
		title: 'Notes on jailbreaking LLMs in the wild.',
		excerpt:
			'A field report on adversarial suffix transfer across aligned models — what worked, what didn\u2019t, and the defenses that held up.',
		tags: ['Sec4AI', 'Field notes'],
	},
	{
		date: 'Coming soon',
		readMinutes: 9,
		title: 'Container supply chains for ML teams — a short playbook.',
		excerpt:
			'Six checks an ML team can run in an afternoon: pinned SHAs, base images, model provenance, telemetry egress, secrets, CI attestation.',
		tags: ['AI4Sec', 'Practice'],
	},
	{
		date: 'Coming soon',
		readMinutes: 4,
		title: 'Reading notes: In-Band Covert Channels on GPU Schedulers.',
		excerpt:
			'Why a timing channel paper about CUDA stream scheduling might matter more to LLM inference hosts than to the graphics community.',
		tags: ['Systems', 'Reading'],
	},
];

function EmptyBlogPreview() {
	return (
		<div>
			<div
				style={{
					marginBottom: 18,
					display: 'flex',
					alignItems: 'baseline',
					justifyContent: 'space-between',
					gap: 16,
					flexWrap: 'wrap',
				}}
			>
				<span className="mono-xs">
					Sample entries — replace with real posts from Notion.
				</span>
			</div>
			{SAMPLE_POSTS.map((p, i) => (
				<div
					key={i}
					className="oc-blog-row"
					style={{
						display: 'grid',
						gridTemplateColumns: '160px 1fr 220px',
						gap: 24,
						alignItems: 'baseline',
						padding: '28px 8px',
						borderBottom:
							i === SAMPLE_POSTS.length - 1
								? 'none'
								: '1px solid var(--rule-soft)',
						opacity: 0.7,
					}}
				>
					<div>
						<div className="mono-xs">{p.date}</div>
						<div className="mono-xs" style={{ marginTop: 4 }}>
							· {p.readMinutes} min read
						</div>
					</div>
					<div>
						<div
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 24,
								lineHeight: 1.25,
								color: 'var(--ink)',
								letterSpacing: '-0.01em',
								marginBottom: 8,
								fontStyle: 'italic',
							}}
						>
							{p.title}
						</div>
						<div className="body-sm" style={{ maxWidth: 680 }}>
							{p.excerpt}
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							gap: 6,
							justifyContent: 'flex-end',
							flexWrap: 'wrap',
						}}
					>
						{p.tags.map(t => (
							<Tag key={t}>{t}</Tag>
						))}
					</div>
				</div>
			))}
			<style jsx>{`
				@media (max-width: 820px) {
					:global(.oc-blog-row) {
						grid-template-columns: 100px 1fr !important;
					}
					:global(.oc-blog-row) > :last-child {
						grid-column: 1 / -1;
						justify-content: flex-start !important;
					}
				}
			`}</style>
		</div>
	);
}

export function BlogIndex({
	posts,
	pageSize = 6,
}: {
	posts: IBlogPost[];
	pageSize?: number;
}) {
	const [page, setPage] = useState(1);

	if (!posts.length) {
		return <EmptyBlogPreview />;
	}
	const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
	const current = Math.min(page, totalPages);
	const start = (current - 1) * pageSize;
	const visible = posts.slice(start, start + pageSize);
	return (
		<div>
			{visible.map((p, i) => (
				<BlogRow key={p.id} p={p} last={i === visible.length - 1} />
			))}
			<Pager
				page={current}
				totalPages={totalPages}
				onChange={setPage}
				total={posts.length}
				pageSize={pageSize}
			/>
			<style jsx>{`
				@media (max-width: 820px) {
					:global(.oc-blog-row) {
						grid-template-columns: 100px 1fr !important;
					}
					:global(.oc-blog-row) > :last-child {
						grid-column: 1 / -1;
						justify-content: flex-start !important;
					}
				}
			`}</style>
		</div>
	);
}
