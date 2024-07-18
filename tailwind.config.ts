// tailwind.config.js
import type { Config } from 'tailwindcss';
const { fontFamily } = require('tailwindcss/defaultTheme');

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				red: '#EC1C24',
				green: '#8AC441',
				peach: '#FFF1DB',
				'light-green': '#A3BE8C',
				'dark-green': '#5E8D87',
				black: '#1A1A1A',
				border: '#5E8D87', // Dark Green
				input: '#5E8D87', // Dark Green
				ring: '#EC1C24', // Red
				background: '#FFF1DB', // Peach
				foreground: '#1A1A1A', // Black
				primary: {
					DEFAULT: '#EC1C24', // Red
					foreground: '#FFF1DB', // Peach
				},
				secondary: {
					DEFAULT: '#8AC441', // Green
					foreground: '#1A1A1A', // Black
				},
				destructive: {
					DEFAULT: '#EC1C24', // Red
					foreground: '#FFF1DB', // Peach
				},
				muted: {
					DEFAULT: '#8AC441', // Green
					foreground: '#5E8D87', // Dark Green
				},
				accent: {
					DEFAULT: '#8AC441', // Green
					foreground: '#1A1A1A', // Black
				},
				popover: {
					DEFAULT: '#A3BE8C', // Light Green
					foreground: '#1A1A1A', // Black
				},
				card: {
					DEFAULT: '#A3BE8C', // Light Green
					foreground: '#1A1A1A', // Black
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			backgroundImage: {
				'text-gradient':
					'linear-gradient(90deg, #EC1C24, #8AC441, #FFF1DB, #A3BE8C, #5E8D87)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			fontFamily: {
				sans: ['var(--font-sans)', ...fontFamily.sans],
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
