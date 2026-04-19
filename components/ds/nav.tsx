'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import { Icon } from './primitives';

const items: ReadonlyArray<[string, string]> = [
	['Work', '/#work'],
	['Writing', '/writing'],
	['About', '/#about'],
	['Contact', '/#contact'],
];

export function Nav() {
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState<string>('');

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 20);
			if (pathname !== '/') return;
			const sections = items
				.filter(([, href]) => href.startsWith('/#'))
				.map(([, href]) => href.slice(2))
				.map(id => {
					const el = document.getElementById(id);
					if (!el) return null;
					const r = el.getBoundingClientRect();
					return { id, top: r.top };
				})
				.filter(Boolean) as Array<{ id: string; top: number }>;
			const above = sections.filter(s => s.top <= 120);
			if (above.length) setActive('/#' + above[above.length - 1].id);
			else setActive('');
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, [pathname]);

	const activeHref = pathname?.startsWith('/writing') ? '/writing' : active;

	return (
		<nav
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 50,
				padding: scrolled ? '12px 20px' : '0',
				transition:
					'padding 260ms var(--ease-out)',
				pointerEvents: 'none',
			}}
		>
			<div
				className={scrolled ? 'oc-nav-inner scrolled' : 'oc-nav-inner'}
				style={{
					maxWidth: scrolled ? 1020 : 1200,
					margin: '0 auto',
					padding: scrolled ? '10px 20px' : '18px 24px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 24,
					pointerEvents: 'auto',
					background: scrolled
						? 'color-mix(in oklab, var(--paper) 88%, transparent)'
						: 'transparent',
					backdropFilter: scrolled ? 'blur(14px) saturate(1.2)' : 'none',
					WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(1.2)' : 'none',
					border: scrolled ? '1px solid var(--rule)' : '1px solid transparent',
					borderRadius: scrolled ? 999 : 0,
					boxShadow: scrolled
						? '0 4px 18px color-mix(in oklab, var(--ink) 10%, transparent)'
						: 'none',
					transition:
						'all 260ms var(--ease-out)',
				}}
			>
				<Link
					href="/"
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						textDecorationLine: 'none',
						color: 'var(--ink)',
					}}
					onClick={e => {
						setOpen(false);
						if (
							typeof window !== 'undefined' &&
							window.location.pathname === '/'
						) {
							e.preventDefault();
							// Remove any lingering hash so re-clicking still works.
							if (window.location.hash) {
								history.replaceState(null, '', '/');
							}
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}
					}}
				>
					<span
						style={{
							width: 28,
							height: 28,
							background: 'var(--ink)',
							color: 'var(--paper)',
							fontFamily: 'var(--font-display)',
							fontSize: 18,
							fontWeight: 400,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							letterSpacing: '-0.04em',
							lineHeight: 1,
						}}
					>
						OC
					</span>
					<span
						style={{
							fontFamily: 'var(--font-sans)',
							fontSize: 14,
							fontWeight: 500,
							letterSpacing: '-0.01em',
							color: 'var(--ink)',
						}}
					>
						Oliver Chou
					</span>
				</Link>

				<div
					className="oc-nav-desktop"
					style={{ display: 'flex', gap: 4, alignItems: 'center' }}
				>
					{items.map(([label, href]) => {
						const isActive = activeHref === href;
						return (
							<Link
								key={href}
								href={href}
								style={{
									padding: '8px 14px',
									fontFamily: 'var(--font-sans)',
									fontSize: 14,
									fontWeight: 500,
									color: isActive ? 'var(--ink)' : 'var(--ink-3)',
									textDecorationLine: 'none',
									position: 'relative',
									letterSpacing: '-0.005em',
								}}
							>
								{label}
								{isActive && (
									<span
										style={{
											position: 'absolute',
											left: 14,
											right: 14,
											bottom: 4,
											height: 1,
											background: 'var(--accent)',
										}}
									/>
								)}
							</Link>
						);
					})}
					<div style={{ marginLeft: 10 }}>
						<ThemeToggle />
					</div>
				</div>

				<button
					type="button"
					className="oc-nav-mobile-trigger"
					aria-label="Menu"
					onClick={() => setOpen(v => !v)}
					style={{
						display: 'none',
						background: 'transparent',
						border: 0,
						color: 'var(--ink)',
						cursor: 'pointer',
						padding: 6,
					}}
				>
					<Icon name={open ? 'x' : 'menu'} size={22} />
				</button>
			</div>

			{open && (
				<div
					className="oc-nav-mobile-panel"
					style={{
						display: 'none',
						borderTop: '1px solid var(--rule)',
						background: 'color-mix(in oklab, var(--paper) 94%, transparent)',
						pointerEvents: 'auto',
					}}
				>
					<div
						style={{
							maxWidth: 1200,
							margin: '0 auto',
							padding: '12px 24px 24px',
							display: 'flex',
							flexDirection: 'column',
							gap: 4,
						}}
					>
						{items.map(([label, href]) => (
							<Link
								key={href}
								href={href}
								onClick={() => setOpen(false)}
								style={{
									padding: '10px 0',
									fontFamily: 'var(--font-sans)',
									fontSize: 16,
									color: 'var(--ink)',
									textDecorationLine: 'none',
									borderBottom: '1px solid var(--rule-soft)',
								}}
							>
								{label}
							</Link>
						))}
						<div style={{ marginTop: 16 }}>
							<ThemeToggle />
						</div>
					</div>
				</div>
			)}

			<style jsx>{`
				@media (max-width: 768px) {
					:global(.oc-nav-desktop) {
						display: none !important;
					}
					:global(.oc-nav-mobile-trigger) {
						display: inline-flex !important;
					}
					:global(.oc-nav-mobile-panel) {
						display: block !important;
					}
				}
			`}</style>
		</nav>
	);
}
