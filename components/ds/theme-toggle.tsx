'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
	const attr = document.documentElement.getAttribute('data-theme');
	if (attr === 'light' || attr === 'dark') return attr;
	const stored = localStorage.getItem('oc:theme');
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia?.('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTheme(currentTheme());
		setMounted(true);
		// Keep in sync with OS changes until the user explicitly picks one.
		const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
		if (!mq) return;
		const handler = () => {
			if (!localStorage.getItem('oc:theme')) {
				setTheme(mq.matches ? 'dark' : 'light');
			}
		};
		mq.addEventListener?.('change', handler);
		return () => mq.removeEventListener?.('change', handler);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('oc:theme', theme);
		const defaultAccent = theme === 'dark' ? 'steel' : 'moss';
		const stored = localStorage.getItem('oc:accent:' + theme) || defaultAccent;
		if (stored === 'steel')
			document.documentElement.removeAttribute('data-accent');
		else document.documentElement.setAttribute('data-accent', stored);
	}, [theme, mounted]);

	const isDark = theme === 'dark';

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			aria-label={isDark ? 'Switch to rock (light) theme' : 'Switch to space (dark) theme'}
			className="chip"
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 8,
				padding: '6px 12px',
				borderRadius: 999,
				cursor: 'pointer',
				transition: 'all 140ms var(--ease-out)',
				background: 'transparent',
			}}
		>
			<span
				className={isDark ? 'glow-accent' : ''}
				style={{
					width: 8,
					height: 8,
					borderRadius: '50%',
					background: isDark ? 'var(--accent)' : 'var(--ink)',
					transition: 'all 220ms var(--ease-out)',
				}}
			/>
			{isDark ? 'space' : 'rock'}
		</button>
	);
}
