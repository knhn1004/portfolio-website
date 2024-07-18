import MainNav from '@/components/main-nav';
import MobileNav from '@/components/mobile-nav';

export default function SiteHeader() {
	return (
		<header className="w-full border-b z-10">
			<div className="flex h-14 items-center px-4">
				<MainNav />
				<MobileNav />
			</div>
		</header>
	);
}
