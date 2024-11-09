import { BackgroundSuccessLayout } from '@/components/layouts/background_success';
import { Suspense } from 'react';
import SuccessContentWithParams from './content_with_params';
import SuccessContent from './content';

export default function SuccessPage() {
	return (
		<div className="flex flex-col items-center pt-5 px-5 pb-16">
			<div className="z-[2] max-w-2xl w-full bg-[#FF8E75] rounded-lg p-5">
				<div className="h-full w-full rounded-lg flex flex-col text-center text-white border border-white relative">
					<Suspense fallback={<SuccessContent />}>
						<SuccessContentWithParams />
					</Suspense>
				</div>
			</div>
			<BackgroundSuccessLayout />
		</div>
	);
}
