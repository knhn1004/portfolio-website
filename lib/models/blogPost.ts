export interface IBlogPost {
	id: string;
	title: string;
	slug: string;
	date: string;
	excerpt: string;
	url: string;
	cover: string;
	tags: string[];
	readMinutes: number | null;
}
