import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class', '[data-theme="dark"]'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1200px',
			},
		},
		extend: {
			colors: {
				paper: 'var(--paper)',
				'paper-2': 'var(--paper-2)',
				'paper-3': 'var(--paper-3)',
				ink: 'var(--ink)',
				'ink-2': 'var(--ink-2)',
				'ink-3': 'var(--ink-3)',
				'ink-4': 'var(--ink-4)',
				'ink-5': 'var(--ink-5)',
				rule: 'var(--rule)',
				'rule-soft': 'var(--rule-soft)',
				accent: 'var(--accent)',
				'accent-hover': 'var(--accent-hover)',
				'accent-soft': 'var(--accent-soft)',
				'accent-ink': 'var(--accent-ink)',
			},
			fontFamily: {
				display: 'var(--font-display)',
				sans: 'var(--font-sans)',
				mono: 'var(--font-mono)',
			},
		},
	},
	plugins: [],
} satisfies Config;

export default config;
