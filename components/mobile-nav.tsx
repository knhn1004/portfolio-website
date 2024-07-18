'use client';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon, Github, Linkedin } from 'lucide-react';
import { redirect } from 'next/navigation';

const mobileItems = [
	{ title: 'OC', link: '/' },
	{ title: 'Projects', link: '/#projects' },
	{ title: 'Publications', link: '/#publications' },
	{ title: 'Honors', link: '/#honors' },
	{ title: 'Contact', link: '/#contact' },
];

export default function MobileNav() {
	const [open, setOpen] = useState(false);
	const [targetLink, setTargetLink] = useState<string | null>(null);

	useEffect(() => {
		if (!open && targetLink) {
			const targetId = targetLink.split('#')[1];
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop,
					behavior: 'smooth',
				});
			}

			// Reset target link after scrolling
			setTargetLink(null);
		}
	}, [open, targetLink]);

	const handleNavigation = (
		e: React.MouseEvent<HTMLButtonElement>,
		link: string
	) => {
		if (!link.startsWith('/')) {
			redirect(link);
		}
		e.preventDefault();
		setTargetLink(link);
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<MenuIcon />
				</Button>
			</SheetTrigger>

			<SheetContent side="left" className="w-64 bg-gray-800">
				<div className="flex flex-col items-start p-4">
					{mobileItems.map(({ link, title }, index) => (
						<Button
							asChild
							key={index}
							variant="link"
							className="w-full text-left"
							onClick={e => handleNavigation(e, link)}
						>
							<a href={link}>{title}</a>
						</Button>
					))}
					<div className="flex gap-2 mt-4">
						<Button className="w-full" variant="link" asChild>
							<a
								href="https://github.com/knhn1004"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github size={20} />
							</a>
						</Button>
						<Button className="w-full" variant="link" asChild>
							<a
								href="https://www.linkedin.com/in/chiahongchou/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Linkedin size={20} />
							</a>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
