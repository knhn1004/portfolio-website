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
				border: '#00ADEF', // Blue
				input: '#00ADEF', // Blue
				ring: '#E91E63', // Pink
				background: '#000000', // Dark Background
				foreground: '#FFFFFF', // White for contrast
				primary: {
					DEFAULT: '#00ADEF', // Blue
					foreground: '#FFFFFF', // White
				},
				secondary: {
					DEFAULT: '#9B59B6', // Purple
					foreground: '#FFFFFF', // White
				},
				destructive: {
					DEFAULT: '#E91E63', // Pink
					foreground: '#FFFFFF', // White
				},
				muted: {
					DEFAULT: '#1ABC9C', // Turquoise
					foreground: '#FFFFFF', // White
				},
				accent: {
					DEFAULT: '#9B59B6', // Purple
					foreground: '#FFFFFF', // White
				},
				popover: {
					DEFAULT: '#1ABC9C', // Turquoise
					foreground: '#FFFFFF', // White
				},
				card: {
					DEFAULT: '#000000', // Dark Background
					foreground: '#FFFFFF', // White
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			backgroundImage: {
				'text-gradient':
					'linear-gradient(90deg, #00ADEF, #9B59B6, #E91E63, #1ABC9C)',
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
				sans: ["'Virgil'", ...fontFamily.sans],
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
