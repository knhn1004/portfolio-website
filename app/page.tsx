import {
	fetchBlogPosts,
	fetchHonors,
	fetchProjects,
	fetchPublications,
} from '@/lib/db/notion';
import { fetchGitHubRepos } from '@/lib/db/github';
import { fetchSemanticScholarPapers } from '@/lib/db/semantic-scholar';
import { fetchPaperMeta } from '@/lib/db/paper-preview';
import { siteConfig } from '@/lib/site-config';
import { Hero } from '@/components/ds/hero';
import { SectionHeader, InlineLink } from '@/components/ds/primitives';
import { ProjectGrid } from '@/components/ds/projects';
import {
	PublicationTable,
	type PublicationRow,
} from '@/components/ds/publications';
import { HonorsList } from '@/components/ds/honors';
import { About } from '@/components/ds/about';
import { ContactForm } from '@/components/ds/contact';
import { Footer } from '@/components/ds/footer';
import { GitHubRepos } from '@/components/ds/github-repos';
import { BlogIndex } from '@/components/ds/blog';

// Revalidate the homepage hourly. Long enough to keep upstream calls
// (Notion, GitHub, Semantic Scholar, paper-meta scrapes) cheap; short
// enough that new posts/papers show up on their own.
export const revalidate = 3600;

function normalizeTitle(s: string): string {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function yearFromDate(iso: string): string {
	if (!iso) return '';
	const y = new Date(iso).getFullYear();
	return Number.isFinite(y) ? String(y) : iso.slice(0, 4);
}

/**
 * Build the unified publication table.
 * Sources (in priority order):
 *   1. Semantic Scholar — authoritative list of papers, reliable API.
 *   2. Notion "Publications" DB — the user's curated list, may carry
 *      their own uploaded figures or extra tags.
 * Titles are normalized and deduped so a paper curated in Notion with a
 * hand-picked image beats the auto-extracted Semantic-Scholar preview.
 * Paper figures are fetched via fetchPaperMeta (og:image on the paper
 * landing page, first figure as fallback).
 */
async function buildPublicationRows(): Promise<PublicationRow[]> {
	const [semantic, notion] = await Promise.all([
		fetchSemanticScholarPapers(
			siteConfig.social.semanticScholar || siteConfig.person.name,
			30
		),
		fetchPublications(),
	]);

	const notionByTitle = new Map(
		notion.map(n => [normalizeTitle(n.title), n])
	);
	const usedNotionKeys = new Set<string>();
	const rows: PublicationRow[] = [];

	for (const s of semantic) {
		const key = normalizeTitle(s.title);
		const match = notionByTitle.get(key);
		if (match) usedNotionKeys.add(key);
		const meta = s.url ? await fetchPaperMeta(s.url) : null;
		rows.push({
			id: s.id,
			title: s.title,
			authors: s.authors,
			year: s.year || yearFromDate(match?.date || ''),
			venue: s.venue,
			url: meta?.paperUrl || s.url,
			previewUrl: meta?.previewImage || match?.image || null,
			tags: match?.tags && match.tags.length ? match.tags : undefined,
		});
	}

	for (const n of notion) {
		const key = normalizeTitle(n.title);
		if (usedNotionKeys.has(key)) continue;
		const meta = n.url ? await fetchPaperMeta(n.url) : null;
		rows.push({
			id: n.id,
			title: n.title,
			year: yearFromDate(n.date),
			url: meta?.paperUrl || n.url,
			previewUrl: meta?.previewImage || n.image || null,
			tags: n.tags.length ? n.tags : undefined,
		});
	}

	return rows;
}

export default async function Home() {
	const [projects, honors, blog, repos, publicationRows] = await Promise.all([
		fetchProjects(),
		fetchHonors(),
		fetchBlogPosts(),
		fetchGitHubRepos(siteConfig.social.githubUser, 6),
		buildPublicationRows(),
	]);

	const sectionStyle = {
		maxWidth: 1200,
		margin: '0 auto',
		padding: '0 24px 96px',
	} as const;

	return (
		<>
			<Hero publicRepos={null} />

			<section id="work" style={sectionStyle}>
				<SectionHeader
					number="01"
					title="Selected Work"
					sub="Projects I build, maintain, and open-source."
				/>
				<ProjectGrid projects={projects} />
			</section>

			<section id="github" style={sectionStyle}>
				<SectionHeader
					number="02"
					title="On GitHub"
					sub="Live from the workshop — pinned repos and recent stars."
					right={
						<InlineLink
							href={siteConfig.social.github}
							target="_blank"
							rel="noopener noreferrer"
						>
							@{siteConfig.social.githubUser} →
						</InlineLink>
					}
				/>
				<GitHubRepos repos={repos} />
			</section>

			<section id="publications" style={sectionStyle}>
				<SectionHeader
					number="03"
					title="Publications"
					sub="Research, writing, and reports I've had a hand in."
					right={
						siteConfig.social.scholar ? (
							<InlineLink
								href={siteConfig.social.scholar}
								target="_blank"
								rel="noopener noreferrer"
							>
								Scholar profile →
							</InlineLink>
						) : undefined
					}
				/>
				<PublicationTable items={publicationRows} />
			</section>

			<section id="writing" style={sectionStyle}>
				<SectionHeader
					number="04"
					title="Writing"
					sub="Field notes, reading logs, and the occasional essay."
				/>
				<BlogIndex posts={blog} />
			</section>

			<section id="honors" style={sectionStyle}>
				<SectionHeader
					number="05"
					title="Honors"
					sub="Recognitions from work along the way."
				/>
				<HonorsList honors={honors} />
			</section>

			<section id="about" style={sectionStyle}>
				<SectionHeader
					number="06"
					title="About"
					sub="A short story about the work and how I got here."
				/>
				<About />
			</section>

			<section id="contact" style={sectionStyle}>
				<SectionHeader
					number="07"
					title="Contact"
					sub="Interested in collaborating, or have a question about the work?"
				/>
				<ContactForm />
			</section>

			<Footer />
		</>
	);
}
