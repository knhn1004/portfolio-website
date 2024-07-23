'use server';
import { Client } from '@notionhq/client';
import { IProject } from '@/lib/models/project';
import { IHonor } from '../models/honor';
import { IPublication } from '../models/publication';

export async function fetchProjects(): Promise<IProject[]> {
	const notion = new Client({ auth: process.env.NOTION_TOKEN });
	const { results } = await notion.databases.query({
		database_id: process.env.PROJECTS_DATABASE_ID || '',
	});
	return results.map(project => ({
		id: project.id as string,
		name: (project as any).properties.Name.title[0].plain_text as string,
		thumbnail:
			(project as any).properties.images.files[0]?.file.url ||
			'https://placehold.co/600x400/000000/FFFFFF/png',
		description: (project as any).properties.Description.rich_text[0]
			.plain_text as string,
		link: (project as any).properties.URL.url,
	}));
}

export async function fetchHonors(): Promise<IHonor[]> {
	const notion = new Client({ auth: process.env.NOTION_TOKEN });
	const { results } = await notion.databases.query({
		database_id: process.env.HONORS_DATABASE_ID || '',
	});
	return results.map(honor => ({
		id: honor.id as string,
		title: (honor as any).properties.title.title[0].plain_text as string,
		date: (honor as any).properties.date.rich_text[0].plain_text as string,
		issuedBy: (honor as any).properties.issuedBy.rich_text[0]
			.plain_text as string,
	}));
}

export async function fetchPublications(): Promise<IPublication[]> {
	const notion = new Client({ auth: process.env.NOTION_TOKEN });
	const { results } = await notion.databases.query({
		database_id: process.env.PUBLICATIONS_DATABASE_ID || '',
	});
	return results.map(publication => ({
		id: publication.id as string,
		title: (publication as any).properties.title.title[0].plain_text as string,
		date: (publication as any).properties.date.date.start as string,
		image: (publication as any).properties.images.files[0]?.file.url as string,
		url: (publication as any).properties.url.url as string,
	}));
}
