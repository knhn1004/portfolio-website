import React from 'react';

export default function Footer() {
	return (
		<footer className="footer container mx-auto text-center min-h-5 py-5">
			&copy; Oliver Chou. All Rights Reserved. {new Date().getFullYear()}
		</footer>
	);
}
