'use client';

import { Icon, InlineLink } from './primitives';
import { siteConfig } from '@/lib/site-config';

export function About() {
	return (
		<>
			<div
				className="oc-about-grid"
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 300px',
					gap: 64,
					marginTop: 40,
				}}
			>
				<div className="prose">
					<p>
						I&rsquo;m {siteConfig.person.name.split(' ')[0]}. I work as a
						full‑stack engineer — shipping across frontend, backend, mobile,
						and the infrastructure that holds it together — with a running
						interest in the places where modern systems are brittle,
						adversarial, or plainly surprising.
					</p>
					<p>
						My current work sits at the intersection of <strong>LLMs</strong>,{' '}
						<strong>network security</strong>, and{' '}
						<strong>multi‑agent systems</strong>: tools that use language
						models to triage incidents, reason about network traffic, and help
						defenders move faster than attackers. I publish when the work is
						worth publishing, and ship it to GitHub when it isn&rsquo;t.
					</p>
					<p>
						I learn best in public — reading papers, breaking things in
						controlled environments, and writing down what was hard. If the
						work below looks like it might intersect yours, please reach out.
					</p>
				</div>

				<aside
					className="oc-about-aside"
					style={{
						borderLeft: '1px solid var(--rule)',
						paddingLeft: 28,
					}}
				>
					<div className="eyebrow" style={{ marginBottom: 14 }}>
						Elsewhere
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<InlineLink
							href={siteConfig.social.github}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								name="github"
								size={14}
								style={{ marginRight: 8, marginBottom: -2 }}
							/>
							GitHub
						</InlineLink>
						<InlineLink
							href={siteConfig.social.scholar}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								name="scholar"
								size={14}
								style={{ marginRight: 8, marginBottom: -2 }}
							/>
							Google Scholar
						</InlineLink>
						<InlineLink
							href={siteConfig.social.linkedin}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								name="linkedin"
								size={14}
								style={{ marginRight: 8, marginBottom: -2 }}
							/>
							LinkedIn
						</InlineLink>
						<InlineLink href="#contact">
							<Icon
								name="mail"
								size={14}
								style={{ marginRight: 8, marginBottom: -2 }}
							/>
							Email
						</InlineLink>
					</div>

					<div style={{ marginTop: 32 }}>
						<div className="eyebrow" style={{ marginBottom: 14 }}>
							Toolkit
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 6,
							}}
						>
							{[
								['Frontend', 'React · Next.js · Tailwind'],
								['Backend', 'Go · Node · Postgres'],
								['Mobile', 'React Native · Swift'],
								['Infra', 'Docker · K8s · AWS'],
								['Research', 'LLMs · Agents · Network security'],
							].map(([k, v]) => (
								<div
									key={k}
									style={{
										display: 'flex',
										gap: 12,
										alignItems: 'baseline',
										paddingBottom: 6,
										borderBottom: '1px solid var(--rule-soft)',
									}}
								>
									<span
										className="mono-xs"
										style={{ minWidth: 72, letterSpacing: '0.08em' }}
									>
										{k}
									</span>
									<span
										style={{
											fontFamily: 'var(--font-sans)',
											fontSize: 13,
											color: 'var(--ink-2)',
										}}
									>
										{v}
									</span>
								</div>
							))}
						</div>
					</div>
				</aside>
			</div>

			<style jsx>{`
				@media (max-width: 820px) {
					:global(.oc-about-grid) {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
					:global(.oc-about-aside) {
						border-left: 0 !important;
						border-top: 1px solid var(--rule) !important;
						padding-left: 0 !important;
						padding-top: 24px !important;
					}
				}
			`}</style>
		</>
	);
}
