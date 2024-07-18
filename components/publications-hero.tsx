'use client';
import React from 'react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import Image from 'next/image';

export function PublicationsHero() {
	return (
		<div className="flex flex-col overflow-hidden">
			<ContainerScroll
				titleComponent={
					<>
						<h1 className="text-xl font-semibold text-white">
							Research in Applied Computer Science and Cyber Security
							<br />
							<span className="text-2xl md:text-[6rem] font-bold mt-1 leading-none">
								Publications
							</span>
						</h1>
					</>
				}
			>
				<Image
					src={`/linear.webp`}
					alt="hero"
					height={720}
					width={1400}
					className="mx-auto rounded-2xl object-cover h-full object-left-top"
					draggable={false}
				/>
			</ContainerScroll>
		</div>
	);
}
