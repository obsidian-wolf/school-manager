import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '../query-client';

export const metadata: Metadata = {
	title: 'School Manager',
	description: '',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head></head>
			<body>
				<ClientProvider>
					<main className="">{children}</main>
				</ClientProvider>
			</body>
		</html>
	);
}
