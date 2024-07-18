import type { Config } from 'tailwindcss';
const { fontFamily } = require('tailwindcss/defaultTheme');
const svgToDataUri = require('mini-svg-data-uri');
const {
	default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

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
				meteor: {
					'0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
					'70%': { opacity: '1' },
					'100%': {
						transform: 'rotate(215deg) translateX(-500px)',
						opacity: '0',
					},
				},
				scroll: {
					to: {
						transform: 'translate(calc(-20% - 0.5rem))',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'meteor-effect': 'meteor 5s linear infinite',
				scroll:
					'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
			},
			fontFamily: {
				sans: ["'Virgil'", ...fontFamily.sans],
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),

		addVariablesForColors,
		function ({ matchUtilities, theme }: any) {
			matchUtilities(
				{
					'bg-dot-thick': (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
						)}")`,
					}),
				},
				{ values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
			);
		},
	],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme('colors'));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		':root': newVars,
	});
}

export default config;
