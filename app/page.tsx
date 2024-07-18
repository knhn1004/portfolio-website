'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';

function Model({ modelPath }: { modelPath: string }) {
	const { scene } = useGLTF(modelPath);
	return <primitive object={scene} />;
}

export default function Home() {
	const modelPath = '/computer.glb';

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="relative flex flex-col items-center">
				
					<h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red via-green via-peach via-light-green to-dark-green pb-5">
						Oliver Chou | SWE
					</h1>
				
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
