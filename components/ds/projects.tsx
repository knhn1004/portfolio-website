'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { IProject } from '@/lib/models/project';
import { Icon, LiveDot, Tag } from './primitives';

/**
 * Description in Notion is a free-form rich_text field, often pasted as a
 * bulleted list run together on one line ("· foo · bar · baz"). For the
 * card we want a single calm sentence — split on bullet/line markers and
 * take the first segment, or truncate at a sensible length.
 */
function shortSummary(raw: string, max = 160): string {
	if (!raw) return '';
	const normalized = raw.replace(/\s+/g, ' ').trim();
	const bulletIdx = normalized.search(/\s+[·•]\s+/);
	const firstSegment =
		bulletIdx > 0 ? normalized.slice(0, bulletIdx).trim() : normalized;
	if (firstSegment.length <= max) return firstSegment.replace(/^[·•]\s*/, '');
	const clipped = firstSegment.slice(0, max);
	const lastSpace = clipped.lastIndexOf(' ');
	return clipped.slice(0, lastSpace > max * 0.6 ? lastSpace : max).replace(/^[·•]\s*/, '') + '…';
}

function ProjectCard({ p }: { p: IProject }) {
	const [hover, setHover] = useState(false);
	const summary = shortSummary(p.description);
	return (
		<Link
			href={`/work/${p.id}`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="surface"
			style={{
				padding: '22px 24px 18px',
				cursor: 'pointer',
				transition: 'all 140ms var(--ease-out)',
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				height: '100%',
				borderRadius: 4,
				textDecoration: 'none',
				color: 'inherit',
			}}
		>
			<div
				style={{
					position: 'relative',
					zIndex: 1,
					display: 'flex',
					flexDirection: 'column',
					gap: 10,
					height: '100%',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12,
					}}
				>
					<span
						className="mono"
						style={{ color: 'var(--ink)', fontWeight: 500, fontSize: 13 }}
					>
						{p.name}
					</span>
					<LiveDot size={6} />
				</div>

				<div>
					<div
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 22,
							lineHeight: 1.25,
							color: 'var(--ink)',
							letterSpacing: '-0.01em',
							marginBottom: 8,
							textDecorationLine: hover ? 'underline' : 'none',
							textDecorationColor: 'var(--accent)',
							textUnderlineOffset: 4,
							display: '-webkit-box',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
					>
						{summary || p.name}
					</div>
				</div>

				<div
					style={{
						marginTop: 'auto',
						paddingTop: 14,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12,
					}}
				>
					<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
						{p.tags.length > 0 ? (
							p.tags.slice(0, 4).map(t => <Tag key={t}>{t}</Tag>)
						) : (
							<Tag>Project</Tag>
						)}
					</div>
					<span
						style={{
							color: hover ? 'var(--accent)' : 'var(--ink-3)',
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
						}}
					>
						<span className="mono-xs">Read case study</span>
						<Icon name="arrowUpRight" size={14} />
					</span>
				</div>
			</div>
		</Link>
	);
}

export function ProjectGrid({
	projects,
	pageSize = 6,
}: {
	projects: IProject[];
	pageSize?: number;
}) {
	const [page, setPage] = useState(1);
	if (!projects.length) {
		return (
			<div
				className="surface"
				style={{
					padding: '48px 24px',
					borderRadius: 4,
					textAlign: 'center',
				}}
			>
				<div className="mono-xs">No projects loaded yet.</div>
			</div>
		);
	}

	const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
	const current = Math.min(page, totalPages);
	const start = (current - 1) * pageSize;
	const visible = projects.slice(start, start + pageSize);

	return (
		<div>
			<div
				className="oc-project-grid"
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					columnGap: 40,
					rowGap: 40,
				}}
			>
				{visible.map(p => (
					<ProjectCard key={p.id} p={p} />
				))}
			</div>
			<Pager
				page={current}
				totalPages={totalPages}
				onChange={setPage}
				total={projects.length}
				pageSize={pageSize}
			/>
			<style jsx>{`
				@media (max-width: 820px) {
					:global(.oc-project-grid) {
						grid-template-columns: 1fr !important;
						row-gap: 24px !important;
					}
				}
			`}</style>
		</div>
	);
}

export function Pager({
	page,
	totalPages,
	onChange,
	total,
	pageSize,
}: {
	page: number;
	totalPages: number;
	onChange: (page: number) => void;
	total: number;
	pageSize: number;
}) {
	if (totalPages <= 1) return null;
	const from = (page - 1) * pageSize + 1;
	const to = Math.min(total, page * pageSize);
	return (
		<div
			style={{
				marginTop: 40,
				paddingTop: 18,
				borderTop: '1px solid var(--rule)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 16,
				flexWrap: 'wrap',
			}}
		>
			<span className="mono-xs">
				Showing {from}–{to} of {total}
			</span>
			<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
				<PagerButton
					label="Previous"
					disabled={page <= 1}
					onClick={() => onChange(page - 1)}
				/>
				{Array.from({ length: totalPages }).map((_, i) => {
					const n = i + 1;
					const active = n === page;
					return (
						<button
							key={n}
							type="button"
							onClick={() => onChange(n)}
							aria-current={active ? 'page' : undefined}
							className="chip"
							style={{
								cursor: active ? 'default' : 'pointer',
								color: active ? 'var(--ink)' : 'var(--ink-3)',
								background: active ? 'var(--paper-2)' : 'transparent',
								fontWeight: active ? 600 : 500,
							}}
						>
							{String(n).padStart(2, '0')}
						</button>
					);
				})}
				<PagerButton
					label="Next"
					disabled={page >= totalPages}
					onClick={() => onChange(page + 1)}
				/>
			</div>
		</div>
	);
}

function PagerButton({
	label,
	disabled,
	onClick,
}: {
	label: string;
	disabled: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="chip"
			style={{
				cursor: disabled ? 'not-allowed' : 'pointer',
				opacity: disabled ? 0.4 : 1,
				color: 'var(--ink)',
				background: 'transparent',
			}}
		>
			{label}
		</button>
	);
}
