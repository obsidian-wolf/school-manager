import { Suspense } from 'react';
import { HomePageContent } from './content';

export default function HomePage() {
	return (
		<Suspense fallback={<div />}>
			<HomePageContent />
		</Suspense>
	);
}
