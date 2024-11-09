'use client';
import React from 'react';
import { ToggleCard } from './_toggle_card';
import { AddressInfoForm } from './_address_info_form';
import { Address } from '@/api/model';

export function BillingDetailsCard({
	billingInfo,
	isComplete,
	isActive,
	onToggle,
	onSubmit,
}: {
	billingInfo?: Address;
	isComplete: boolean;
	isActive: boolean;
	onToggle: (isActive: boolean) => void;
	onSubmit: (data: Address) => Promise<void>;
}) {
	return (
		<ToggleCard
			title="Billing Details"
			isComplete={isComplete}
			isActive={isActive}
			onToggle={onToggle}
		>
			{billingInfo && (
				<AddressInfoForm
					addressInfo={billingInfo}
					onSubmit={onSubmit}
					buttonLabel="Continue to Shipping"
				/>
			)}
		</ToggleCard>
	);
}
