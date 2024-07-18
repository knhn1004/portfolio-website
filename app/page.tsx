'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SparklesCore } from '@/components/ui/sparkles';
import { motion } from 'framer-motion';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';

function Model({ modelPath }: { modelPath: string }) {
	const { scene, animations } = useGLTF(modelPath);
	const ref = useRef();
	const { actions } = useAnimations(animations, ref);

	useEffect(() => {
		actions['Animation']?.play();
	}, [actions]);


	return (
		<primitive
			ref={ref}
			object={scene}
			scale={[20, 20, 20]}
			position={[0, 0, -50]}
		/>
	);
}

export default function Home() {
	const modelPath = '/3d/spaceship.glb';

	return (
		<div className="h-[40rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
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
			<HeroHighlight>
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
					className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
				>
					Oliver Chou
					<br/>
					<Highlight className="text-black dark:text-white">
						Software Engineer
					</Highlight>
				</motion.h1>
			</HeroHighlight>

			<Canvas
				gl={{ preserveDrawingBuffer: true }}
				style={{ width: '100vw', height: '100vh' }}
				camera={{ position: [0, 2, 40], fov: 45 }}
			>
				<Suspense fallback={null}>
					<ambientLight intensity={30} />
					<directionalLight position={[10, 10, 10]} intensity={30} />
					<pointLight position={[-10, -10, -10]} intensity={30} />
					<Model modelPath={modelPath} />
				</Suspense>
			</Canvas>
		</div>
	);
}
