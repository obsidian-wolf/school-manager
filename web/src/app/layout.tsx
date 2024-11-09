import type { Metadata } from 'next';
import { Lora, Montserrat, Libre_Baskerville } from 'next/font/google';
import './globals.css';
import { ClientProvider } from '../query-client';
import { Header } from './_header';

const lora = Lora({
	variable: '--font-lora',
	subsets: ['latin'],
});
const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin'],
});
const baskerville = Libre_Baskerville({
	variable: '--font-baskerville',
	subsets: ['latin'],
	weight: ['400'],
});

export const metadata: Metadata = {
	title: 'Ellie MD',
	description: 'Longevity with a purpose',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="icon"
					href="https://elliemd.com/wp-content/uploads/2024/05/cropped-Ellie-MD-Favicon-1-32x32.png"
					sizes="32x32"
				/>
				<link
					rel="icon"
					href="https://elliemd.com/wp-content/uploads/2024/05/cropped-Ellie-MD-Favicon-1-192x192.png"
					sizes="192x192"
				></link>
				<link
					rel="apple-touch-icon"
					href="https://elliemd.com/wp-content/uploads/2024/05/cropped-Ellie-MD-Favicon-1-180x180.png"
				></link>
			</head>
			<body
				className={`${lora.variable} ${montserrat.variable} ${baskerville.variable} min-h-screen flex flex-col`}
			>
				<ClientProvider>
					<Header />
					<main className="relative min-h-screen -mt-[91px] pt-[91px]">{children}</main>
				</ClientProvider>
			</body>
		</html>
	);
}
