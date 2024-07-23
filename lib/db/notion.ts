'use server';
import { Client } from '@notionhq/client';
import { IProject } from '@/lib/models/project';

export async function fetchProjects(): Promise<IProject[]> {
	const notion = new Client({ auth: process.env.NOTION_TOKEN });
	const { results } = await notion.databases.query({
		database_id: process.env.PROJECTS_DATABASE_ID || '',
	});
	return results.map(project => ({
		id: project.id as string,
		name: (project as any).properties.Name.title[0].plain_text as string,
		thumbnail: (project as any).properties.images.files[0].file.url as string,
		description: (project as any).properties.Description.rich_text[0]
			.plain_text as string,
		link: (project as any).properties.URL.url,
	}));
}
