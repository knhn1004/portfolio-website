'use client';

import { useState } from 'react';
import type { IHonor } from '@/lib/models/honor';

function HonorRow({ h, last }: { h: IHonor; last: boolean }) {
	const [hover, setHover] = useState(false);
	return (
		<div
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="oc-honor-row"
			style={{
				display: 'grid',
				gridTemplateColumns: '160px 1fr 220px',
				gap: 24,
				alignItems: 'baseline',
				padding: '24px 8px',
				borderBottom: last ? 'none' : '1px solid var(--rule-soft)',
				transition: 'background 120ms var(--ease-out)',
				background: hover ? 'var(--paper-2)' : 'transparent',
			}}
		>
			<div>
				<div className="mono-xs">{h.date}</div>
			</div>
			<div
				style={{
					fontFamily: 'var(--font-display)',
					fontSize: 22,
					lineHeight: 1.25,
					color: 'var(--ink)',
					letterSpacing: '-0.01em',
				}}
			>
				{h.title}
			</div>
			<div
				className="mono"
				style={{ textAlign: 'right', color: 'var(--ink-3)' }}
			>
				{h.issuedBy}
			</div>
		</div>
	);
}

export function HonorsList({ honors }: { honors: IHonor[] }) {
	if (!honors.length) {
		return (
			<div
				className="surface"
				style={{
					padding: '48px 24px',
					borderRadius: 4,
					textAlign: 'center',
				}}
			>
				<div className="mono-xs">No honors loaded yet.</div>
			</div>
		);
	}
	return (
		<div>
			<div
				className="oc-honor-header"
				style={{
					display: 'grid',
					gridTemplateColumns: '160px 1fr 220px',
					gap: 24,
					padding: '10px 8px',
					borderBottom: '1px solid var(--ink)',
				}}
			>
				{['Date', 'Honor', 'Issued by'].map((h, i) => (
					<span
						key={i}
						className="mono-xs"
						style={{
							letterSpacing: '0.1em',
							textTransform: 'uppercase',
							color: 'var(--ink-3)',
							textAlign: i === 2 ? 'right' : 'left',
						}}
					>
						{h}
					</span>
				))}
			</div>
			{honors.map((h, i) => (
				<HonorRow key={h.id} h={h} last={i === honors.length - 1} />
			))}
			<style jsx>{`
				@media (max-width: 700px) {
					:global(.oc-honor-row),
					:global(.oc-honor-header) {
						display: flex !important;
						flex-direction: column !important;
						gap: 6px !important;
						padding: 18px 4px !important;
					}
					:global(.oc-honor-header) {
						display: none !important;
					}
					:global(.oc-honor-row) > :nth-child(1) {
						order: 1;
					}
					:global(.oc-honor-row) > :nth-child(2) {
						order: 2;
						font-size: 19px !important;
					}
					:global(.oc-honor-row) > :last-child {
						order: 3;
						text-align: left !important;
					}
				}
			`}</style>
		</div>
	);
}
