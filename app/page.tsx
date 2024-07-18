'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { WavyBackground } from '@/components/ui/wavy-background';

function Model({ modelPath }: { modelPath: string }) {
	const { scene, animations } = useGLTF(modelPath);
	const ref = useRef();
	const { actions } = useAnimations(animations, ref);

	useEffect(() => {
		console.log(Object.keys(actions));
		actions['Animation']?.play();
	}, [actions]);

	//useFrame(() => {
	//	ref.current.rotation.y += 0.01; // Rotate the model for animation
	//});

	return (
		<primitive
			ref={ref}
			object={scene}
			scale={[8, 8, 8]}
			position={[0, 0, -50]}
		/>
	);
}

export default function Home() {
	const modelPath = '/3d/spaceship.glb';

	return (
		<WavyBackground className="max-w-4xl mx-auto pb-40">
			<Canvas
				gl={{ preserveDrawingBuffer: true }}
				style={{ width: '600px', height: '300px' }}
				camera={{ position: [0, 2, 40], fov: 45 }}
			>
				<Suspense fallback={null}>
					<ambientLight intensity={30} />
					<directionalLight position={[10, 10, 10]} intensity={30} />
					<pointLight position={[-10, -10, -10]} intensity={30} />
					<Model modelPath={modelPath} />
				</Suspense>
			</Canvas>
		</WavyBackground>
	);
}
