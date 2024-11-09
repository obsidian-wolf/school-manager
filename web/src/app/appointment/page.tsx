import React, { Suspense } from 'react';
import { BackgroundSuccessLayout } from '@/components/layouts/background_success';
import AppointmentContent from './content';

export default function AppointmentPage() {
	return (
		<div className="flex flex-col items-center pt-5 px-5 pb-16">
			<h3 className="max-w-2xl px-4 text-[#6FCAC7] text-sm pb-4 font-normal text-center">
				Thank you! Your payment has been processed. Please select an appointment below to
				meet with a licensed medical provider.
			</h3>
			<div className="z-[2] max-w-2xl w-full bg-[#FF8E75] rounded-lg p-5 flex gap-5 justify-stretch">
				<Suspense fallback={<div />}>
					<AppointmentContent />
				</Suspense>
			</div>
			<BackgroundSuccessLayout />
		</div>
	);
}
