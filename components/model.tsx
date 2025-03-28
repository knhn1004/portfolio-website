'use client';
import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group } from "three";

export function Model({
	modelPath, position, rotation, scale,
}: {
	modelPath: string;
	position: number[];
	rotation: number[];
	scale: number[];
}) {
	const { scene, animations } = useGLTF(modelPath);
	const ref = useRef<Group>(null);
	const { actions } = useAnimations(animations, ref);

	useEffect(() => {
		actions['FLY']?.play();
	}, [actions]);

	return (
		<primitive
			ref={ref}
			object={scene}
			scale={scale}
			position={position}
			rotation={rotation} />
	);
}
