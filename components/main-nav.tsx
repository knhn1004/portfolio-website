import Link from 'next/link';
import { Button } from './ui/button';
import { Github, Linkedin } from 'lucide-react';

const mainNavItems = [
	{ title: 'OC', link: '/' },
	{ title: 'Projects', link: '/#projects' },
	{ title: 'Publications', link: '/#publications' },
	{ title: 'Honors', link: '/#honors' },
	{ title: 'Contact', link: '/#contact' },
];

export default function MainNav() {
	return (
		<div className="mr-4 hidden gap-2 md:flex items-center justify-between w-full">
			<div className="flex gap-2">
				{mainNavItems.map(({ title, link }, index) => (
					<Button key={index} variant="link" asChild>
						<Link href={link}>{title}</Link>
					</Button>
				))}
			</div>
			<div className="flex gap-2 ml-auto">
				<Button asChild variant="link">
					<a
						href="https://github.com/knhn1004"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github size={20} />
					</a>
				</Button>
				<Button asChild variant="link">
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
	);
}
