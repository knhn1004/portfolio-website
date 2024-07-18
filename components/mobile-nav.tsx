'use client';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon, Github, Linkedin } from 'lucide-react';

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
							key={index}
							variant="link"
							className="w-full text-left"
							onClick={() => {
								setOpen(false);
							}}
						>
							{item}
						</Button>
					))}
					<div className="flex gap-2 mt-4">
						<Button className="w-full" variant="link">
							<Github size={20} />
						</Button>
						<Button className="w-full" variant="link">
							<Linkedin size={20} />
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
