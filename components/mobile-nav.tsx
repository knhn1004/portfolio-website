'use client';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

const mobileItems = [
	'OC',
	'About',
	'Experiences',
	'Projects',
	'Publications',
	'Awards',
	'Contact',
];

export default function MobileNav() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			{/* This button will trigger open the mobile sheet menu */}
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<MenuIcon />
				</Button>
			</SheetTrigger>

			<SheetContent side="left" className="w-64 bg-gray-800">
				<div className="flex flex-col items-start p-4">
					{mobileItems.map((item, index) => (
						<Button
							asChild
							key={index}
							variant="link"
							className="w-full text-left"
							onClick={() => {
								setOpen(false);
							}}
						>
							<Link href="#">{item}</Link>
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
