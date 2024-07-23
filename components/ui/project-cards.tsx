import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

const Paginations = ({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) => {
	const createPageNumbers = () => {
		const pages = [];
		for (let i = 1; i <= totalPages; i++) {
			pages.push(
				<PaginationItem key={i}>
					<PaginationLink
						href="#"
						isActive={currentPage === i}
						onClick={e => {
							e.preventDefault();
							onPageChange(i);
						}}
					>
						{i}
					</PaginationLink>
				</PaginationItem>
			);
		}
		return pages;
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={e => {
							e.preventDefault();
							if (currentPage > 1) onPageChange(currentPage - 1);
						}}
					/>
				</PaginationItem>
				{createPageNumbers()}
				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={e => {
							e.preventDefault();
							if (currentPage < totalPages) onPageChange(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export const ProjectCards = ({
	items,
	className,
	itemsPerPage = 6,
}: {
	items: {
		name: string;
		description: string;
		link: string;
	}[];
	className?: string;
	itemsPerPage?: number;
}) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const totalPages = Math.ceil(items.length / itemsPerPage);

	const displayedItems = items.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<div
				className={cn(
					'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10',
					className
				)}
				style={{ minHeight: 'calc(2 * 16rem)' }} // Assuming each card has a height of 16rem
			>
				{displayedItems.map((item, idx) => (
					<Link
						href={item?.link}
						key={item?.link}
						className="relative group block p-2 h-full w-full"
						onMouseEnter={() => setHoveredIndex(idx)}
						onMouseLeave={() => setHoveredIndex(null)}
					>
						<AnimatePresence>
							{hoveredIndex === idx && (
								<motion.span
									className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
									layoutId="hoverBackground"
									initial={{ opacity: 0 }}
									animate={{
										opacity: 1,
										transition: { duration: 0.15 },
									}}
									exit={{
										opacity: 0,
										transition: { duration: 0.15, delay: 0.2 },
									}}
								/>
							)}
						</AnimatePresence>
						<Card>
							<CardTitle>{item.name}</CardTitle>
							<CardDescription>{item.description}</CardDescription>
						</Card>
					</Link>
				))}
			</div>
			<div className="container mx-auto">
				<Paginations
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={page => setCurrentPage(page)}
				/>
			</div>
		</>
	);
};

export const Card = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				'rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20',
				className
			)}
		>
			<div className="relative z-50">
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
};
export const CardTitle = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<h4 className={cn('text-zinc-100 font-bold tracking-wide mt-4', className)}>
			{children}
		</h4>
	);
};
export const CardDescription = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<p
			className={cn(
				'mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm',
				className
			)}
		>
			{children}
		</p>
	);
};
