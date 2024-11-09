'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/button';
import { PaymentCardContent, PaymentCardContentRef } from './content';
import { ToggleCard } from '../_toggle_card';
import { OrderDetails } from '@/api/model';

export function PaymentCard({
	orderId,
	isReady,
	isActive,
	onToggle,
	price,
	orderDetails,
}: {
	orderId: string;
	isReady: boolean;
	isActive: boolean;
	onToggle?: (isActive: boolean) => void;
	price: number;
	orderDetails?: OrderDetails;
}) {
	const contentRef = useRef<PaymentCardContentRef>({ triggerSubmit: () => {} });
	const [isLoading, setIsLoading] = useState(false);

	return (
		<>
			<ToggleCard title="Payment" isComplete={false} isActive={isActive} onToggle={onToggle}>
				{isReady && orderDetails && (
					<PaymentCardContent
						orderId={orderId}
						price={price}
						ref={contentRef}
						orderDetails={orderDetails}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
				)}
			</ToggleCard>
			{isReady && (
				<div className="flex justify-end max-w-2xl space-x-2 pt-8">
					<Button
						variant="primary"
						loading={isLoading}
						onClick={() => contentRef.current.triggerSubmit()}
					>
						NEXT
					</Button>
				</div>
			)}
		</>
	);
}
