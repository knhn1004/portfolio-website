'use client';

import { useState } from 'react';
import { Tag } from './primitives';
import { BlurImage } from './blur-image';

export interface PublicationRow {
	id: string;
	title: string;
	authors?: string;
	year: string;
	venue?: string;
	url: string;
	previewUrl?: string | null;
	tags?: string[];
}

function Row({
	p,
	index,
	last,
}: {
	p: PublicationRow;
	index: number;
	last: boolean;
}) {
	const [hover, setHover] = useState(false);
	const num = String(index + 1).padStart(2, '0');
	return (
		<a
			href={p.url}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="oc-pub-row"
			style={{
				display: 'grid',
				gridTemplateColumns: '60px 70px 150px 1fr 180px',
				gap: 24,
				alignItems: 'start',
				padding: '24px 8px',
				borderBottom: last ? 'none' : '1px solid var(--rule-soft)',
				cursor: 'pointer',
				transition: 'background 120ms var(--ease-out)',
				background: hover ? 'var(--paper-2)' : 'transparent',
				textDecorationLine: 'none',
				color: 'inherit',
			}}
		>
			<div className="oc-pub-meta" style={{ display: 'contents' }}>
				<span
					className="mono-xs"
					style={{ color: 'var(--ink-4)', paddingTop: 4 }}
				>
					§{num}
				</span>
				<span
					className="mono-xs"
					style={{ color: 'var(--ink-3)', paddingTop: 4 }}
				>
					{p.year || '—'}
				</span>
			</div>
			<div
				className="oc-pub-preview"
				style={{
					aspectRatio: '4 / 3',
					background: 'var(--paper-2)',
					border: '1px solid var(--rule-soft)',
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: p.previewUrl ? 0 : 12,
				}}
			>
				{p.previewUrl ? (
					<BlurImage src={p.previewUrl} alt={p.title} />
				) : (
					<PreviewFallback venue={p.venue} url={p.url} />
				)}
			</div>
			<div style={{ paddingTop: 2 }}>
				<div
					className="oc-pub-title"
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 22,
						lineHeight: 1.25,
						color: 'var(--ink)',
						letterSpacing: '-0.005em',
						textDecorationLine: hover ? 'underline' : 'none',
						textDecorationColor: 'var(--accent)',
						textUnderlineOffset: 4,
						marginBottom: 6,
					}}
				>
					{p.title}
				</div>
				{p.authors && (
					<div className="body-sm" style={{ marginBottom: 8 }}>
						{p.authors}
					</div>
				)}
				{p.tags && p.tags.length > 0 && (
					<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
						{p.tags.slice(0, 3).map(t => (
							<Tag key={t}>{t}</Tag>
						))}
					</div>
				)}
			</div>
			<div style={{ paddingTop: 2 }}>
				{p.venue ? <Tag tone="ok">{p.venue}</Tag> : null}
			</div>
		</a>
	);
}

function hostOf(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return '';
	}
}

function PreviewFallback({ venue, url }: { venue?: string; url: string }) {
	const host = hostOf(url);
	const primary = venue || host || 'No figure';
	const secondary = venue && host ? host : '';
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 6,
				textAlign: 'center',
			}}
		>
			<div
				style={{
					fontFamily: 'var(--font-display)',
					fontSize: 18,
					lineHeight: 1.2,
					color: 'var(--ink-2)',
					letterSpacing: '-0.005em',
					fontStyle: 'italic',
					maxWidth: '100%',
				}}
			>
				{primary}
			</div>
			{secondary && (
				<div
					className="mono-xs"
					style={{ color: 'var(--ink-4)', letterSpacing: '0.08em' }}
				>
					{secondary}
				</div>
			)}
		</div>
	);
}

export function PublicationTable({ items }: { items: PublicationRow[] }) {
	if (!items.length) {
		return (
			<div
				className="surface"
				style={{
					padding: '48px 24px',
					borderRadius: 4,
					textAlign: 'center',
				}}
			>
				<div className="mono-xs">No publications loaded yet.</div>
			</div>
		);
	}
	return (
		<div>
			<div
				className="oc-pub-header"
				style={{
					display: 'grid',
					gridTemplateColumns: '60px 70px 150px 1fr 180px',
					gap: 24,
					padding: '10px 8px',
					borderBottom: '1px solid var(--ink)',
				}}
			>
				{['No.', 'Year', 'Figure', 'Title', 'Venue'].map((h, i) => (
					<span
						key={i}
						className="mono-xs"
						style={{
							letterSpacing: '0.1em',
							textTransform: 'uppercase',
							color: 'var(--ink-3)',
						}}
					>
						{h}
					</span>
				))}
			</div>
			{items.map((p, i) => (
				<Row key={p.id} p={p} index={i} last={i === items.length - 1} />
			))}
			<style jsx>{`
				@media (max-width: 720px) {
					:global(.oc-pub-header) {
						display: none !important;
					}
					:global(.oc-pub-row) {
						display: flex !important;
						flex-direction: column !important;
						gap: 10px !important;
						padding: 20px 4px !important;
					}
					:global(.oc-pub-row) :global(.oc-pub-meta) {
						display: flex !important;
						gap: 10px;
						align-items: baseline;
					}
					:global(.oc-pub-row) :global(.oc-pub-meta) > * {
						padding-top: 0 !important;
					}
					:global(.oc-pub-row) :global(.oc-pub-preview) {
						display: none !important;
					}
					:global(.oc-pub-row) :global(.oc-pub-title) {
						font-size: 19px !important;
					}
				}
			`}</style>
		</div>
	);
}
