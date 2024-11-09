'use client';
import React, { useRef } from 'react';
import { Button } from '@/components/button';
import { PaymentCardContent, PaymentCardContentRef } from './content';
import { ToggleCard } from '../_toggle_card';

export function PaymentCard({
	orderId,
	installmentId,
}: {
	orderId: string;
	installmentId: string;
}) {
	const contentRef = useRef<PaymentCardContentRef>({ triggerSubmit: () => {} });

	return (
		<>
			<ToggleCard title="Payment">
				<PaymentCardContent
					orderId={orderId}
					installmentId={installmentId}
					ref={contentRef}
				/>
			</ToggleCard>
			<div className="flex justify-end max-w-2xl space-x-2 pt-8">
				<Button variant="primary" onClick={() => contentRef.current.triggerSubmit()}>
					NEXT
				</Button>
			</div>
		</>
	);
}
