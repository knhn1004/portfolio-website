'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

export function BlurImage({
	src,
	alt,
	style,
}: {
	src: string;
	alt: string;
	style?: CSSProperties;
}) {
	const [loaded, setLoaded] = useState(false);
	const ref = useRef<HTMLImageElement | null>(null);

	// If the browser already finished loading the image before React hydrated
	// (common on fast networks + small figures), the `load` event fires before
	// our listener attaches. Catch that case on mount.
	useEffect(() => {
		const el = ref.current;
		if (el && el.complete && el.naturalWidth > 0) {
			setLoaded(true);
		}
	}, []);

	return (
		// Plain img — Notion / arxiv / MDPI / ar5iv URLs aren't hosts we
		// can statically allowlist in next.config.
		// eslint-disable-next-line @next/next/no-img-element
		<img
			ref={ref}
			src={src}
			alt={alt}
			loading="lazy"
			decoding="async"
			onLoad={() => setLoaded(true)}
			onError={() => setLoaded(true)}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				filter: loaded
					? 'saturate(0.85) contrast(0.98) blur(0)'
					: 'saturate(0.85) contrast(0.98) blur(14px)',
				transform: loaded ? 'scale(1)' : 'scale(1.04)',
				opacity: loaded ? 1 : 0.8,
				transition:
					'filter 520ms var(--ease-out), transform 520ms var(--ease-out), opacity 260ms var(--ease-out)',
				...style,
			}}
		/>
	);
}
