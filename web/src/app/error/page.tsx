import { BackgroundSuccessLayout } from '@/components/layouts/background_success';
import { Suspense } from 'react';
import { ErrorContentWithParams } from './content_with_params';
import { ErrorContent } from './content';

export default function ErrorPage() {
	return (
		<div className="flex flex-col items-center pt-5 px-5 pb-16">
			<div className="z-[2] max-w-2xl w-full bg-[#456] rounded-lg p-5">
				<div className="h-full w-full rounded-lg flex flex-col text-center text-white border border-white relative pb-8">
					<Suspense fallback={<ErrorContent />}>
						<ErrorContentWithParams />
					</Suspense>
				</div>
			</div>
			<BackgroundSuccessLayout />
		</div>
	);
}
