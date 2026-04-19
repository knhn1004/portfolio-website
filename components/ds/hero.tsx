'use client';

import { Button, Icon, InlineLink, LiveDot } from './primitives';
import { siteConfig } from '@/lib/site-config';

export function Hero({
	publicRepos,
}: {
	publicRepos: number | null;
}) {
	const strip: Array<[string, string]> = [
		['Focus areas', 'Security · AI · Full‑stack systems'],
	];
	if (publicRepos) strip.push(['On GitHub', `${publicRepos} public repos`]);

	return (
		<section
			style={{
				maxWidth: 1200,
				margin: '0 auto',
				padding: '96px 24px 128px',
				position: 'relative',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					marginBottom: 40,
				}}
			>
				<LiveDot />
				<span
					className="mono-xs"
					style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
				>
					Engineering &amp; research · {new Date().getFullYear()}
				</span>
			</div>

			<h1
				style={{
					fontFamily: 'var(--font-display)',
					fontSize: 'clamp(56px, 8.4vw, 116px)',
					lineHeight: 0.98,
					letterSpacing: '-0.025em',
					color: 'var(--ink)',
					fontWeight: 400,
					margin: 0,
					maxWidth: 1100,
				}}
			>
				Artisan, builder,
				<br />
				<span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>
					thinker
				</span>
				<span style={{ color: 'var(--accent)' }}>.</span>
			</h1>

			<div
				className="oc-hero-grid"
				style={{
					marginTop: 56,
					display: 'grid',
					gridTemplateColumns: '1fr 420px',
					gap: 80,
					alignItems: 'start',
				}}
			>
				<p
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 21,
						lineHeight: 1.55,
						color: 'var(--ink-2)',
						maxWidth: 620,
						margin: 0,
					}}
				>
					I&rsquo;m{' '}
					<strong style={{ color: 'var(--ink)', fontWeight: 500 }}>
						{siteConfig.person.name}
					</strong>
					 — {siteConfig.person.tagline} I build things carefully, study how
					they break, and write about what I learn along the way.
				</p>

				<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
					<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
						<Button href="#publications">
							Read publications <span>→</span>
						</Button>
						<Button variant="ghost" href="#about">
							About
						</Button>
					</div>
					<div
						style={{
							display: 'flex',
							gap: 18,
							marginTop: 12,
							flexWrap: 'wrap',
						}}
					>
						<InlineLink href="#contact">
							<Icon
								name="mail"
								size={14}
								style={{ marginRight: 6, marginBottom: -2 }}
							/>
							Email
						</InlineLink>
						<InlineLink
							href={siteConfig.social.github}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								name="github"
								size={14}
								style={{ marginRight: 6, marginBottom: -2 }}
							/>
							GitHub
						</InlineLink>
						<InlineLink
							href={siteConfig.social.linkedin}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								name="linkedin"
								size={14}
								style={{ marginRight: 6, marginBottom: -2 }}
							/>
							LinkedIn
						</InlineLink>
						<InlineLink
							href={siteConfig.social.scholar}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								name="scholar"
								size={14}
								style={{ marginRight: 6, marginBottom: -2 }}
							/>
							Scholar
						</InlineLink>
					</div>
				</div>
			</div>

			<div
				className="oc-hero-footer"
				style={{
					marginTop: 112,
					paddingTop: 20,
					borderTop: '1px solid var(--rule)',
					display: 'flex',
					justifyContent: 'space-between',
					gap: 24,
					flexWrap: 'wrap',
				}}
			>
				{strip.map(([k, v]) => (
					<div
						key={k}
						style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}
					>
						<span
							className="mono-xs"
							style={{
								letterSpacing: '0.08em',
								textTransform: 'uppercase',
								minWidth: 110,
							}}
						>
							{k}
						</span>
						<span
							style={{
								fontFamily: 'var(--font-sans)',
								fontSize: 14,
								color: 'var(--ink-2)',
							}}
						>
							{v}
						</span>
					</div>
				))}
			</div>

			<style jsx>{`
				@media (max-width: 820px) {
					:global(.oc-hero-grid) {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
				}
			`}</style>
		</section>
	);
}
