'use client';
import React from 'react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import Image from 'next/image';
import { IPublication } from '@/lib/models/publication';

export function PublicationsHero({
	publication,
}: {
	publication: IPublication;
}) {
	console.log(publication);
	return (
		<div className="flex flex-col overflow-hidden">
			<ContainerScroll
				titleComponent={
					<>
						<h1 className="text-xl font-semibold text-white">
							Research in Applied Computer Science and Cyber Security
							<br />
							<span className="text-2xl md:text-[4rem] font-bold mt-1 leading-none">
								Publications
							</span>
						</h1>
					</>
				}
			>
				<a href={publication.url} target="_blank" rel="noreferrer">
					<Image
						src={publication.image}
						alt={publication.title}
						height={720}
						width={1400}
						className="mx-auto rounded-2xl object-cover object-center h-full"
						draggable={false}
					/>
				</a>
			</ContainerScroll>
		</div>
	);
}
