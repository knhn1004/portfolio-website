// Centralised, env-driven site configuration. Defaults here must NEVER
// contain personal data (real name, real email, real social URLs) — this
// file ships in the public repo. Per-deployment values live in .env.local
// (ignored) or the hosting provider's environment panel.

export const siteConfig = {
	person: {
		name: process.env.NEXT_PUBLIC_NAME || 'Your Name',
		tagline:
			process.env.NEXT_PUBLIC_TAGLINE ||
			'Software engineer working across security, AI, and full-stack systems.',
		location: process.env.NEXT_PUBLIC_LOCATION || '',
		email: process.env.NEXT_PUBLIC_EMAIL || '',
	},
	social: {
		github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
		githubUser: process.env.NEXT_PUBLIC_GITHUB_USER || '',
		linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
		scholar: process.env.NEXT_PUBLIC_SCHOLAR_URL || '',
		scholarUser: process.env.NEXT_PUBLIC_SCHOLAR_USER || '',
		// Semantic Scholar — a numeric authorId (https://www.semanticscholar.org/author/{id})
		// or a full name. If unset, falls back to person.name.
		semanticScholar: process.env.NEXT_PUBLIC_SEMANTIC_SCHOLAR_AUTHOR || '',
	},
	research: {
		citationCount: process.env.NEXT_PUBLIC_CITATION_COUNT || '',
		hIndex: process.env.NEXT_PUBLIC_H_INDEX || '',
	},
	meta: {
		title:
			process.env.NEXT_PUBLIC_SITE_TITLE ||
			'Portfolio — Engineering & Research',
		description:
			process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
			'Software engineer working across security, AI, and full-stack systems. Projects, publications, and writing.',
		umamiSrc: process.env.NEXT_PUBLIC_UMAMI_SRC,
		umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
	},
} as const;

export function hasSocial(
	k: 'github' | 'linkedin' | 'scholar'
): boolean {
	return !!siteConfig.social[k];
}
