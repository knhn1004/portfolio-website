import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import Script from 'next/script';
import { Nav } from '@/components/ds/nav';
import { SvgFilters } from '@/components/ds/svg-filters';
import { ThemeInit } from '@/components/ds/theme-init';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
	title: siteConfig.meta.title,
	description: siteConfig.meta.description,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeInit />
			</head>
			<body suppressHydrationWarning>
				<Script
					defer
					src={process.env.NEXT_PUBLIC_UMAMI_SRC}
					data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
				/>
				<ReCaptchaProvider
					reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
				>
					<SvgFilters />
					<Nav />
					<main>{children}</main>
					<Toaster />
				</ReCaptchaProvider>
			</body>
		</html>
	);
}
