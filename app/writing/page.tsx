import { fetchBlogPosts } from '@/lib/db/notion';
import { BlogIndex } from '@/components/ds/blog';
import { SectionHeader } from '@/components/ds/primitives';
import { Footer } from '@/components/ds/footer';

export const revalidate = 3600;

export const metadata = {
	title: 'Writing',
	description: 'Field notes, reading logs, and the occasional essay.',
};

export default async function WritingIndexPage() {
	const posts = await fetchBlogPosts();
	return (
		<>
			<section
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					padding: '64px 24px 96px',
				}}
			>
				<SectionHeader
					number="01"
					title="Writing"
					sub="Field notes, reading logs, and the occasional essay."
				/>
				<BlogIndex posts={posts} pageSize={12} />
			</section>
			<Footer />
		</>
	);
}
