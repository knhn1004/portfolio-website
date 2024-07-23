import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/site-header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ReCaptchaProvider } from 'next-recaptcha-v3';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Oliver Chou | Portfolio',
	description: 'Oliver Chou Portfolio',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ReCaptchaProvider
			reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
		>
			<html lang="en">
				<body className={`${inter.className} layout`}>
					<Header />
					<main>{children}</main>
					<Toaster />
					<Footer />
				</body>
			</html>
		</ReCaptchaProvider>
	);
}
