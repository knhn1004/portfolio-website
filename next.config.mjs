/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'aceternity.com',
				port: '',
				pathname: '**/*',
			},
			{
				protocol: 'https',
				hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
				port: '',
				pathname: '**/*',
			},
			{
				protocol: 'https',
				hostname: 'placehold.co',
				port: '',
				pathname: '**/*',
			},
		],
	},
};

export default nextConfig;
