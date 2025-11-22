'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { SparklesCore } from '@/components/ui/sparkles';
import { motion } from 'framer-motion';
import { PublicationsHero } from '@/components/publications-hero';
import { FlipWords } from '@/components/ui/flip-words';
import { ProjectsParallax } from '@/components/ui/projects-parallax';
import { Model } from '@/components/model';
import { Meteors } from '@/components/ui/meteors';
import { ProjectCards } from '@/components/ui/project-cards';
import { HonorsSlider } from '@/components/ui/honors-slider';
import { ContactForm } from '@/components/contact-form';
import { fetchHonors, fetchProjects, fetchPublications } from '@/lib/db/notion';
import { IProject } from '@/lib/models/project';
import { IHonor } from '@/lib/models/honor';
import { IPublication } from '@/lib/models/publication';

export default function Home() {
	const spaceship = '/3d/spaceship-cb2.glb';
	const subtitle = '/3d/subtitle.glb';
	const [projects, setProjects] = useState<IProject[]>([]);
	const [honors, setHonors] = useState<IHonor[]>([]);
	const [publications, setPublications] = useState<IPublication[]>([]);

	useEffect(() => {
		const getProjects = async () => {
			const _ = await fetchProjects();
			setProjects(_);
		};
		const getHonors = async () => {
			const _ = await fetchHonors();
			setHonors(_);
		};
		const getPublications = async () => {
			const _ = await fetchPublications();
			setPublications(_);
		};
		getProjects();
		getHonors();
		getPublications();
	}, []);

	return (
		<div className="container mx-auto">
			<div className="h-[40rem] relative w-full bg-black flex flex-col md:flex-row items-center justify-center overflow-hidden rounded-md">
				<div className="w-full absolute inset-0 h-screen">
					<SparklesCore
						id="tsparticlesfullpage"
						background="transparent"
						minSize={0.6}
						maxSize={1.4}
						particleDensity={50}
						className="w-full h-full"
						particleColor="#FFFFFF"
					/>
					<Meteors number={50} />
				</div>
				<div className="flex-1 md:flex-none md:w-1/3 flex flex-col items-center justify-center z-10">
					<motion.h1
						initial={{
							opacity: 0,
							y: 20,
						}}
						animate={{
							opacity: 1,
							y: [20, -5, 0],
						}}
						transition={{
							duration: 0.5,
							ease: [0.4, 0.0, 0.2, 1],
						}}
						className="text-4xl px-4 lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
					>
						Oliver Chou
						<br />
						<span className="text-2xl">
							<FlipWords
								words={[
									'Software Engineer',
									'Cyber Security',
									'DevOps',
									'Mobile Development',
									'Web Development',
									'Artificial Intelligence',
									'Entrepreneur',
								]}
							/>
						</span>
					</motion.h1>
				</div>
				<div className="flex-1 w-full h-full z-0">
					<Canvas
						gl={{ preserveDrawingBuffer: true }}
						style={{ width: '100%', height: '100%' }}
						camera={{ position: [0, 40, 20] }}
					>
						<Suspense fallback={null}>
							<ambientLight intensity={50} />
							<directionalLight position={[10, 10, 10]} intensity={20} />
							<pointLight position={[-10, -10, -10]} intensity={20} />
							<Model
								modelPath={spaceship}
								position={[0, -30, -30]}
								rotation={[0, Math.PI / 6, Math.PI / 6]}
								scale={[2, 2, 2]}
							/>
							<Model
								modelPath={subtitle}
								position={[0, -120, 10]}
								rotation={[0, 0, 0]}
								scale={[20, 20, 20]}
							/>
						</Suspense>
					</Canvas>
				</div>
			</div>
			<div id="projects" className="container pt-5">
				<ProjectsParallax projects={projects} />
				<ProjectCards items={projects} />
			</div>
			<div id="publications" className="container pt-5">
				{publications.length > 0 && (
					<PublicationsHero publication={publications[0]} />
				)}
			</div>
			<div id="honors" className="container pt-5">
				<h2 className="text-2xl md:text-[4rem] font-bold text-center">
					Honors
				</h2>
				<HonorsSlider items={honors} />
			</div>
			<div id="contact" className="container pt-5">
				<h2 className="text-2xl md:text-[4rem] font-bold text-center my-4">
					Drop Your Question
				</h2>
				<ContactForm />
			</div>
		</div>
	);
}
