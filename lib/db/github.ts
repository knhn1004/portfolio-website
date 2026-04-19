'use server';

import type { IRepo } from '@/lib/models/repo';
import { parsePinnedRepoNames } from './github-parse';

const REVALIDATE_SECONDS = 60 * 60; // 1 hour — anonymous GitHub REST is 60 req/h per IP.

export interface GitHubProfile {
	name: string;
	bio: string;
	location: string;
	followers: number;
	publicRepos: number;
	avatarUrl: string;
	htmlUrl: string;
}

function headers(): Record<string, string> {
	const h: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'oliverchou-web',
	};
	const t = process.env.GITHUB_TOKEN;
	if (t) h.Authorization = `Bearer ${t}`;
	return h;
}

function browserHeaders(): Record<string, string> {
	return {
		'User-Agent':
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
		'Accept-Language': 'en-US,en;q=0.9',
	};
}

export async function fetchGitHubProfile(
	user: string
): Promise<GitHubProfile | null> {
	if (!user) return null;
	try {
		const res = await fetch(`https://api.github.com/users/${user}`, {
			headers: headers(),
			next: { revalidate: REVALIDATE_SECONDS },
		});
		if (!res.ok) return null;
		const d = await res.json();
		return {
			name: d.name || user,
			bio: d.bio || '',
			location: d.location || '',
			followers: d.followers ?? 0,
			publicRepos: d.public_repos ?? 0,
			avatarUrl: d.avatar_url || '',
			htmlUrl: d.html_url || `https://github.com/${user}`,
		};
	} catch {
		return null;
	}
}

/**
 * Resolve which repos to show in the "On GitHub" section, in priority order:
 *   1. `GITHUB_PINNED_REPOS` env (explicit allow-list, preserves order)
 *   2. The user's pinned repos scraped from their public profile HTML
 *      (GitHub REST does not expose pinned repos; this mirrors exactly
 *      what visitors see on github.com/<user>)
 *   3. Top repos by stargazer count, then most-recent push
 *
 * Every fetch is wrapped so a single source failing never takes the whole
 * section down — we always fall through to the next option.
 */
export async function fetchGitHubRepos(
	user: string,
	limit = 6
): Promise<IRepo[]> {
	if (!user) return [];

	const envPinned = (process.env.GITHUB_PINNED_REPOS || '')
		.split(',')
		.map(s => s.trim())
		.filter(Boolean);

	const explicitPinned = envPinned.length
		? envPinned
		: await scrapePinnedRepoNames(user);

	if (explicitPinned.length) {
		const fetched = await Promise.all(
			explicitPinned.map(name => fetchRepo(user, name))
		);
		const repos = fetched.filter((r): r is IRepo => r !== null);
		if (repos.length) return repos.slice(0, limit);
	}

	try {
		const res = await fetch(
			`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100&type=owner`,
			{ headers: headers(), next: { revalidate: REVALIDATE_SECONDS } }
		);
		if (!res.ok) return [];
		const all = (await res.json()) as any[];
		const ranked = all
			.filter(r => !r.fork && !r.archived && !r.private)
			.sort(
				(a, b) =>
					(b.stargazers_count ?? 0) - (a.stargazers_count ?? 0) ||
					new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
			);
		return ranked.slice(0, limit).map(mapRepo);
	} catch {
		return [];
	}
}

async function fetchRepo(user: string, name: string): Promise<IRepo | null> {
	try {
		const res = await fetch(`https://api.github.com/repos/${user}/${name}`, {
			headers: headers(),
			next: { revalidate: REVALIDATE_SECONDS },
		});
		if (!res.ok) return null;
		return mapRepo(await res.json());
	} catch {
		return null;
	}
}

async function scrapePinnedRepoNames(user: string): Promise<string[]> {
	return parsePinnedRepoNames(await fetchProfileHtml(user), user);
}

async function fetchProfileHtml(user: string): Promise<string> {
	try {
		const res = await fetch(`https://github.com/${user}`, {
			headers: browserHeaders(),
			next: { revalidate: REVALIDATE_SECONDS },
		});
		if (!res.ok) return '';
		return await res.text();
	} catch {
		return '';
	}
}

function mapRepo(r: any): IRepo {
	return {
		id: String(r.id),
		name: r.name,
		description: r.description || '',
		url: r.html_url,
		stars: r.stargazers_count ?? 0,
		language: r.language || '',
		updatedAt: r.pushed_at || r.updated_at || '',
		topics: Array.isArray(r.topics) ? r.topics : [],
	};
}
