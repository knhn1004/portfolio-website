import { Icon, InlineLink } from './primitives';

export function Footer() {
	return (
		<footer
			style={{
				borderTop: '1px solid var(--rule)',
				marginTop: 120,
				padding: '40px 24px',
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'baseline',
					gap: 24,
					flexWrap: 'wrap',
				}}
			>
				<div className="mono-xs">
					© Oliver Chou · 2026 — built for engineering, read like paper.
				</div>
				<div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
					<InlineLink
						href="https://github.com/knhn1004"
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
						href="https://www.linkedin.com/in/chiahongchou/"
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
					<InlineLink href="#contact">
						<Icon
							name="mail"
							size={14}
							style={{ marginRight: 6, marginBottom: -2 }}
						/>
						Email
					</InlineLink>
				</div>
			</div>
		</footer>
	);
}
