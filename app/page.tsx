'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SparklesCore } from '@/components/ui/sparkles';
import { motion } from 'framer-motion';
import { LaptopScroll } from '@/components/laptop-scroll';
import { FlipWords } from '@/components/ui/flip-words';
import { ProjectsParallax } from '@/components/ui/projects-parallax';
import { projects } from '@/lib/data/projects';

function Model({ modelPath }: { modelPath: string }) {
	const { scene, animations } = useGLTF(modelPath);
	const ref = useRef();
	const { actions } = useAnimations(animations, ref);

	useEffect(() => {
		actions['FLY']?.play();
	}, [actions]);

	return (
		<primitive
			ref={ref}
			object={scene}
			scale={[2, 2, 2]}
			position={[0, -30, -30]}
			rotation={[0, Math.PI / 6, Math.PI/ 6]}
		/>
	);
}

export default function Home() {
	const modelPath = '/3d/spaceship-cb2.glb';

	return (
		<div className="container">
			<div className="h-[40rem] relative w-full bg-black flex flex-col md:flex-row items-center justify-center overflow-hidden rounded-md">
				<div className="w-full absolute inset-0 h-screen">
					<SparklesCore
						id="tsparticlesfullpage"
						background="transparent"
						minSize={0.6}
						maxSize={1.4}
						particleDensity={100}
						className="w-full h-full"
						particleColor="#FFFFFF"
					/>
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
						className="text-4xl px-4 lg:text-5xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
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
							<Model modelPath={modelPath} />
						</Suspense>
					</Canvas>
				</div>
			</div>
			<div className="container pt-5">
				<LaptopScroll />
			</div>
			<div className="container pt-5">
			<ProjectsParallax projects={projects} />
			</div>
		</div>
	);
}
