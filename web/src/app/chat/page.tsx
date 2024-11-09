import { Suspense } from 'react';
import { ChatPageContent } from './content';

export default function HomePage() {
	return (
		<Suspense fallback={<div />}>
			<ChatPageContent />
		</Suspense>
	);
}
