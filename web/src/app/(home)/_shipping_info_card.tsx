'use client';
import React from 'react';
import { ToggleCard } from './_toggle_card';
import { Checkbox } from '@/components/checkbox';
import { AddressInfoForm } from './_address_info_form';
import { Address } from '@/api/model';
import { Button } from '@/components/button';

export function ShippingDetailsCard({
	shippingInfo,
	isComplete,
	isActive,
	onToggle,
	onSubmit: _onSubmit,
	isShipToBilling,
	setIsShipToBilling,
}: {
	shippingInfo?: Address;
	isComplete: boolean;
	isActive: boolean;
	onToggle?: (isActive: boolean) => void;
	onSubmit: (data: Address | undefined) => Promise<void>;
	isShipToBilling: boolean;
	setIsShipToBilling: (value: boolean) => void;
}) {
	const [loading, setLoading] = React.useState(false);

	async function onSubmit(state: Address) {
		setLoading(true);
		await _onSubmit(isShipToBilling ? undefined : state);
		setLoading(false);
	}

	return (
		<ToggleCard
			title="Shipping Details"
			isComplete={isComplete}
			isActive={isActive}
			onToggle={onToggle}
		>
			{shippingInfo && (
				<>
					<div className={'pb-6'}>
						<Checkbox
							checked={isShipToBilling}
							onChange={() => {
								setIsShipToBilling(!isShipToBilling);
							}}
							label="Ship to Billing Address"
						/>
					</div>
					{!isShipToBilling ? (
						<AddressInfoForm
							addressInfo={shippingInfo}
							onSubmit={onSubmit}
							buttonLabel="Continue to Payment"
						/>
					) : (
						<div className="flex flex-col">
							<Button
								variant="primary"
								onClick={() => onSubmit(shippingInfo)}
								loading={loading}
							>
								Continue to Payment
							</Button>
						</div>
					)}
				</>
			)}
		</ToggleCard>
	);
}
