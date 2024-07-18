import { Button } from './ui/button';
import { Github, Linkedin } from 'lucide-react';

const mainNavItems = [
	'OC',
	'About',
	'Experiences',
	'Projects',
	'Publications',
	'Awards',
	'Contact',
];

export default function MainNav() {
	return (
		<div className="mr-4 hidden gap-2 md:flex items-center justify-between w-full">
			<div className="flex gap-2">
				{mainNavItems.map((item, index) => (
					<Button key={index} variant="link">
						{item}
					</Button>
				))}
			</div>
			<div className="flex gap-2 ml-auto">
				<Button  variant="link">
					<Github size={20} />
				</Button>
				<Button variant="link">
					<Linkedin size={20} />
				</Button>
			</div>
		</div>
	);
}
