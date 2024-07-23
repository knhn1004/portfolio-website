'use server';
import { Client } from '@notionhq/client';
import { IProject } from '@/lib/models/project';
import { IHonor } from '../models/honor';

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
			'https://placehold.co/600x400/jpg',
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
	console.log(results);
	return results.map(honor => ({
		id: honor.id as string,
		title: (honor as any).properties.title.title[0].plain_text as string,
		date: (honor as any).properties.date.rich_text[0].plain_text as string,
		issuedBy: (honor as any).properties.issuedBy.rich_text[0]
			.plain_text as string,
	}));
}
