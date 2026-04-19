'use client';

import {
	type CSSProperties,
	type ReactNode,
	type MouseEvent,
	useState,
} from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'ok' | 'warn' | 'alert' | 'solid';

const TONE_STYLE: Record<Tone, CSSProperties> = {
	neutral: {},
	ok: {
		color: 'var(--signal-ok)',
		borderColor: 'color-mix(in oklab, var(--signal-ok) 40%, transparent)',
	},
	warn: {
		color: 'var(--signal-warn)',
		borderColor: 'color-mix(in oklab, var(--signal-warn) 40%, transparent)',
	},
	alert: {
		color: 'var(--accent)',
		borderColor: 'var(--accent)',
		background: 'var(--accent-soft)',
	},
	solid: {
		color: 'var(--paper)',
		borderColor: 'var(--ink)',
		background: 'var(--ink)',
	},
};

export function Tag({
	children,
	tone = 'neutral',
	style,
}: {
	children: ReactNode;
	tone?: Tone;
	style?: CSSProperties;
}) {
	return (
		<span
			className="chip"
			style={{ display: 'inline-block', lineHeight: 1.3, ...TONE_STYLE[tone], ...style }}
		>
			{children}
		</span>
	);
}

export function Eyebrow({
	children,
	className = '',
	style,
}: {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<div className={cn('eyebrow', className)} style={style}>
			{children}
		</div>
	);
}

export function Mono({
	children,
	className = '',
	style,
}: {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<span className={cn('mono', className)} style={style}>
			{children}
		</span>
	);
}

export function Rule({ style }: { style?: CSSProperties }) {
	return <hr className="rule-themed" style={{ margin: 0, ...style }} />;
}

type ButtonVariant = 'primary' | 'ghost' | 'accent';

export function Button({
	children,
	variant = 'primary',
	onClick,
	href,
	type = 'button',
	target,
	rel,
	className,
	style,
	disabled,
}: {
	children: ReactNode;
	variant?: ButtonVariant;
	onClick?: (e: MouseEvent<HTMLElement>) => void;
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	target?: string;
	rel?: string;
	className?: string;
	style?: CSSProperties;
	disabled?: boolean;
}) {
	const variantClass = variant === 'ghost' ? 'btn btn--ghost' : 'btn';
	const variantOverride: CSSProperties =
		variant === 'accent'
			? {
					color: 'var(--accent-ink)',
				}
			: {};
	const accentBefore =
		variant === 'accent'
			? ({
					['--btn-bg' as string]: 'var(--accent)',
				} as CSSProperties)
			: {};
	if (href) {
		return (
			<a
				href={href}
				onClick={onClick}
				target={target}
				rel={rel}
				className={cn(variantClass, className)}
				style={{ ...variantOverride, ...accentBefore, ...style }}
			>
				{children}
			</a>
		);
	}
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={cn(variantClass, className)}
			style={{ ...variantOverride, ...accentBefore, ...style }}
		>
			{children}
		</button>
	);
}

export function InlineLink({
	children,
	href,
	onClick,
	arrow = false,
	target,
	rel,
	style,
}: {
	children: ReactNode;
	href?: string;
	onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
	arrow?: boolean;
	target?: string;
	rel?: string;
	style?: CSSProperties;
}) {
	const [hover, setHover] = useState(false);
	return (
		<a
			href={href || '#'}
			onClick={e => {
				if (onClick) {
					if (!href || href === '#') e.preventDefault();
					onClick(e);
				}
			}}
			target={target}
			rel={rel}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				color: hover ? 'var(--accent)' : 'var(--ink)',
				textDecorationLine: 'underline',
				textDecorationColor: hover ? 'var(--accent)' : 'var(--rule)',
				textUnderlineOffset: 3,
				textDecorationThickness: 1,
				transition: 'all 120ms var(--ease-out)',
				textShadow: hover
					? '0 0 10px color-mix(in oklab, var(--accent) 30%, transparent)'
					: 'none',
				...style,
			}}
		>
			{children}
			{arrow && (
				<span style={{ marginLeft: 4, display: 'inline-block' }}>→</span>
			)}
		</a>
	);
}

export function SectionHeader({
	number,
	title,
	sub,
	right,
}: {
	number: string;
	title: string;
	sub?: ReactNode;
	right?: ReactNode;
}) {
	return (
		<div
			className="section-tick"
			style={{
				marginBottom: 32,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'baseline',
				gap: 24,
				paddingTop: 16,
				flexWrap: 'wrap',
			}}
		>
			<div>
				<div className="eyebrow" style={{ marginBottom: 12 }}>
					§{number} — {title}
				</div>
				{sub && (
					<div
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 36,
							lineHeight: 1.1,
							color: 'var(--ink)',
							letterSpacing: '-0.01em',
							maxWidth: 720,
						}}
					>
						{sub}
					</div>
				)}
			</div>
			{right && <div style={{ flexShrink: 0 }}>{right}</div>}
		</div>
	);
}

export function LiveDot({
	color = 'var(--accent)',
	size = 8,
}: {
	color?: string;
	size?: number;
}) {
	return (
		<span
			style={{
				position: 'relative',
				display: 'inline-block',
				width: size,
				height: size,
			}}
		>
			<span
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					background: color,
					animation: 'oc-pulse 1.8s ease-out infinite',
				}}
			/>
			<span
				className="glow-accent"
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					background: color,
				}}
			/>
		</span>
	);
}

type IconName =
	| 'arrow'
	| 'arrowUpRight'
	| 'shield'
	| 'github'
	| 'linkedin'
	| 'scholar'
	| 'file'
	| 'mail'
	| 'terminal'
	| 'bookOpen'
	| 'gitBranch'
	| 'search'
	| 'menu'
	| 'x'
	| 'copy'
	| 'chevronRight'
	| 'chevronDown'
	| 'cite'
	| 'sun'
	| 'moon'
	| 'external';

export function Icon({
	name,
	size = 18,
	color = 'currentColor',
	style,
}: {
	name: IconName;
	size?: number;
	color?: string;
	style?: CSSProperties;
}) {
	const paths: Record<IconName, ReactNode> = {
		arrow: (
			<>
				<line x1="5" y1="12" x2="19" y2="12" />
				<polyline points="12 5 19 12 12 19" />
			</>
		),
		arrowUpRight: (
			<>
				<line x1="7" y1="17" x2="17" y2="7" />
				<polyline points="7 7 17 7 17 17" />
			</>
		),
		shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
		github: (
			<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
		),
		linkedin: (
			<>
				<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
				<rect x="2" y="9" width="4" height="12" />
				<circle cx="4" cy="4" r="2" />
			</>
		),
		scholar: (
			<>
				<polygon points="12 2 2 7 12 12 22 7 12 2" />
				<polyline points="6 9 6 14 12 17 18 14 18 9" />
			</>
		),
		file: (
			<>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
				<polyline points="14 2 14 8 20 8" />
			</>
		),
		mail: (
			<>
				<rect x="3" y="5" width="18" height="14" rx="2" />
				<polyline points="3 7 12 13 21 7" />
			</>
		),
		terminal: (
			<>
				<polyline points="4 17 10 11 4 5" />
				<line x1="12" y1="19" x2="20" y2="19" />
			</>
		),
		bookOpen: (
			<>
				<path d="M2 3h7a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
				<path d="M22 3h-7a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h8z" />
			</>
		),
		gitBranch: (
			<>
				<line x1="6" y1="3" x2="6" y2="15" />
				<circle cx="18" cy="6" r="3" />
				<circle cx="6" cy="18" r="3" />
				<path d="M18 9a9 9 0 0 1-9 9" />
			</>
		),
		search: (
			<>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</>
		),
		menu: (
			<>
				<line x1="4" y1="7" x2="20" y2="7" />
				<line x1="4" y1="12" x2="20" y2="12" />
				<line x1="4" y1="17" x2="20" y2="17" />
			</>
		),
		x: (
			<>
				<line x1="6" y1="6" x2="18" y2="18" />
				<line x1="18" y1="6" x2="6" y2="18" />
			</>
		),
		copy: (
			<>
				<rect x="9" y="9" width="13" height="13" rx="2" />
				<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
			</>
		),
		chevronRight: <polyline points="9 18 15 12 9 6" />,
		chevronDown: <polyline points="6 9 12 15 18 9" />,
		cite: (
			<path d="M3 21c3-4 3-7 3-9V5h6v7H8c0 3-2 6-5 9zM15 21c3-4 3-7 3-9V5h6v7h-4c0 3-2 6-5 9z" />
		),
		sun: (
			<>
				<circle cx="12" cy="12" r="4" />
				<line x1="12" y1="2" x2="12" y2="5" />
				<line x1="12" y1="19" x2="12" y2="22" />
				<line x1="2" y1="12" x2="5" y2="12" />
				<line x1="19" y1="12" x2="22" y2="12" />
				<line x1="4.9" y1="4.9" x2="7" y2="7" />
				<line x1="17" y1="17" x2="19.1" y2="19.1" />
				<line x1="4.9" y1="19.1" x2="7" y2="17" />
				<line x1="17" y1="7" x2="19.1" y2="4.9" />
			</>
		),
		moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />,
		external: (
			<>
				<path d="M15 3h6v6" />
				<path d="M10 14L21 3" />
				<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			</>
		),
	};
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{ flexShrink: 0, ...style }}
		>
			{paths[name]}
		</svg>
	);
}
