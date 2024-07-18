'use client';

import {useRef} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

function Model({ modelPath }: { modelPath: string }) {
	const { scene } = useGLTF(modelPath);
	const ref = useRef();

	useFrame(() => {
		if (ref.current) {
			(ref.current as any).rotation.y += 0.01; // Adjust rotation speed as needed
		}
	});
	return <primitive ref={ref} object={scene} rotation={[0.1, -0.2, 0]} />;
}

export default function Home() {
	const modelPath = '/computer.glb';

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="relative flex flex-col items-center">
				<motion.h1
					className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--chart-1)] via-[var(--chart-2)] via-[var(--chart-3)] via-[var(--chart-4)] to-[var(--chart-5)] pb-5"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					Oliver Chou | SWE
				</motion.h1>

				<Canvas
					gl={{ preserveDrawingBuffer: true }}
					style={{ width: '400px', height: '400px' }}
					camera={{ position: [0, 0, 8] }}
				>
					<OrbitControls
						// autoRotate
						maxPolarAngle={Math.PI / 2}
						minPolarAngle={Math.PI / 2}
						enableZoom={false}
						enablePan={false}
					/>
					<ambientLight intensity={1} />
					<directionalLight position={[0, 0, 8]} />
					<Suspense fallback={null}>
						<Model modelPath={modelPath} />
					</Suspense>
				</Canvas>
			</div>
		</main>
	);
}
