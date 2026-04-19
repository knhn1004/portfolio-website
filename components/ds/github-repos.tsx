'use client';

import { useState } from 'react';
import type { IRepo } from '@/lib/models/repo';
import { Icon, Tag } from './primitives';

function timeAgo(iso: string): string {
	if (!iso) return '';
	const then = new Date(iso).getTime();
	const now = Date.now();
	const diff = Math.max(0, now - then);
	const d = diff / (1000 * 60 * 60 * 24);
	if (d < 1) return 'today';
	if (d < 2) return 'yesterday';
	if (d < 30) return `${Math.round(d)}d ago`;
	if (d < 365) return `${Math.round(d / 30)}mo ago`;
	return `${Math.round(d / 365)}y ago`;
}

function RepoCard({ r }: { r: IRepo }) {
	const [hover, setHover] = useState(false);
	return (
		<a
			href={r.url}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="surface"
			style={{
				padding: '20px 22px 18px',
				cursor: 'pointer',
				textDecoration: 'none',
				color: 'inherit',
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				height: '100%',
				borderRadius: 4,
			}}
		>
			<div
				style={{
					position: 'relative',
					zIndex: 1,
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
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
						style={{
							color: 'var(--ink)',
							fontWeight: 500,
							fontSize: 13,
							textDecorationLine: hover ? 'underline' : 'none',
							textDecorationColor: 'var(--accent)',
							textUnderlineOffset: 4,
						}}
					>
						{r.name}
					</span>
					<span
						className="mono-xs"
						style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}
					>
						★ {r.stars}
					</span>
				</div>
				<div
					className="body-sm"
					style={{
						color: 'var(--ink-2)',
						fontSize: 14,
						lineHeight: 1.5,
						minHeight: 42,
					}}
				>
					{r.description || (
						<span style={{ color: 'var(--ink-4)' }}>
							No description — open the repo to see what&rsquo;s inside.
						</span>
					)}
				</div>
				<div
					style={{
						marginTop: 'auto',
						paddingTop: 10,
						display: 'flex',
						gap: 6,
						flexWrap: 'wrap',
						alignItems: 'center',
					}}
				>
					{r.language && <Tag>{r.language}</Tag>}
					{r.topics.slice(0, 2).map(t => (
						<Tag key={t}>{t}</Tag>
					))}
					<span
						className="mono-xs"
						style={{ marginLeft: 'auto', display: 'inline-flex', gap: 4 }}
					>
						{timeAgo(r.updatedAt)} <Icon name="arrowUpRight" size={12} />
					</span>
				</div>
			</div>
		</a>
	);
}

export function GitHubRepos({ repos }: { repos: IRepo[] }) {
	if (!repos.length) {
		return (
			<div
				className="surface"
				style={{
					padding: '48px 24px',
					borderRadius: 4,
					textAlign: 'center',
				}}
			>
				<div className="mono-xs">
					Live GitHub data couldn&rsquo;t be loaded. Try again later.
				</div>
			</div>
		);
	}
	return (
		<div
			className="oc-repo-grid"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				columnGap: 24,
				rowGap: 24,
			}}
		>
			{repos.map(r => (
				<RepoCard key={r.id} r={r} />
			))}
			<style jsx>{`
				@media (max-width: 1100px) {
					:global(.oc-repo-grid) {
						grid-template-columns: repeat(2, 1fr) !important;
					}
				}
				@media (max-width: 700px) {
					:global(.oc-repo-grid) {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</div>
	);
}
