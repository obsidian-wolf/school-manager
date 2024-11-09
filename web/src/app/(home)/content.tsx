'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from './_product_card';
import { BillingDetailsCard } from './_billing_info_card';
import { ShippingDetailsCard } from './_shipping_info_card';
import { Address, OrderDetails } from '@/api/model';
import { ErrorOverlay } from '@/components/error_overlay';
import { AcknowledgementCard } from './_acknowledgment_card';
import { PaymentCard } from './(payment_card)';
import { getOrderDetails, useSubmitBillingAndShipping } from '@/api/endpoints';

function areAddressesEqual(address1: Address, address2: Address): boolean {
	return (
		address1.address === address2.address &&
		address1.city === address2.city &&
		address1.email === address2.email &&
		address1.firstName === address2.firstName &&
		address1.lastName === address2.lastName &&
		address1.phone === address2.phone &&
		address1.middleName === address2.middleName &&
		address1.postcode === address2.postcode &&
		address1.stateCode === address2.stateCode
	);
}

export function PayContent() {
	const [isError, setIsError] = React.useState<string | undefined>(undefined);
	const searchParams = useSearchParams();
	const router = useRouter();
	const orderId = searchParams.get('orderId')!;
	const [orderDetails, setOrderDetails] = React.useState<OrderDetails | undefined>(undefined);

	const [billingInfo, setBillingInfo] = React.useState<
		{ isComplete: boolean; state: Address } | undefined
	>(undefined);
	const [shippingInfo, setShippingInfo] = React.useState<
		{ isComplete: boolean; state: Address } | undefined
	>(undefined);
	const [isShipToBilling, setIsShipToBilling] = React.useState(true);
	const [hasAcceptedTerms, _setHasAcceptedTerms] = useState(false);

	function setHasAcceptedTerms(value: boolean) {
		_setHasAcceptedTerms(value);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('returningId', orderId);
		}
	}

	const [step, setStep] = React.useState<'billing' | 'shipping' | 'acknowledgements' | 'payment'>(
		'billing'
	);
	const submitBillingAndShipping = useSubmitBillingAndShipping();

	// Get a value from localstorage the first render
	const isReturning = useMemo(() => {
		if (typeof window !== 'undefined') {
			return orderId === window.localStorage.getItem('returningId');
		}
	}, [orderId]);

	useEffect(() => {
		if (
			billingInfo &&
			shippingInfo &&
			isReturning &&
			!billingInfo.isComplete &&
			!shippingInfo.isComplete
		) {
			_setHasAcceptedTerms(true);
			setBillingInfo((x) => ({ state: x!.state, isComplete: true }));
			setShippingInfo((x) => ({ state: x!.state, isComplete: true }));

			setStep('payment');
		}
	}, [isReturning, billingInfo, shippingInfo]);

	const onShippingSubmit = async (state: Address | undefined) => {
		const shippingState = isShipToBilling ? billingInfo!.state! : state!;

		try {
			await submitBillingAndShipping.mutateAsync({
				orderId,
				data: {
					billing: billingInfo!.state!,
					shipping: shippingState,
				},
			});
			setStep('acknowledgements');
		} catch {
			setIsError('unknown');
		} finally {
			setShippingInfo({
				state: shippingState,
				isComplete: true,
			});
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const response = await getOrderDetails(orderId);

				setOrderDetails(response);
				setBillingInfo({ state: response.billing, isComplete: false });
				setShippingInfo({ state: response.shipping, isComplete: false });

				const isSame = areAddressesEqual(response.billing, response.shipping);
				setIsShipToBilling(isSame);
			} catch {
				router.push(`/error?type=already_processed`);
			}
		})();
	}, [orderId, router]);

	if (!orderId) {
		return null;
	}
	// const products = orderDetails?.products;

	// let price =
	// 	products?.reduce((acc, product) => acc + product.retailPrice * product.monthSupply, 0) || 0;
	// // if (medication?.switchFrom) {
	// // 	price -= medication.switchFrom.retailPrice * medication.switchFrom.monthSupply;
	// // }

	return (
		<>
			<ErrorOverlay type={isError} onClose={() => setIsError(undefined)} />

			<ProductCard orderDetails={orderDetails} />

			<>
				<BillingDetailsCard
					isComplete={!!billingInfo?.isComplete}
					isActive={step === 'billing'}
					billingInfo={billingInfo?.state}
					onToggle={(isActive) => setStep(isActive ? 'billing' : 'shipping')}
					onSubmit={async (state) => {
						setBillingInfo({ state, isComplete: true });
						setStep('shipping');
					}}
				/>

				<ShippingDetailsCard
					isComplete={!!shippingInfo?.isComplete}
					isActive={step === 'shipping'}
					shippingInfo={shippingInfo?.state}
					onToggle={
						billingInfo?.isComplete
							? (isActive) => setStep(isActive ? 'shipping' : 'acknowledgements')
							: undefined
					}
					setIsShipToBilling={(value) => {
						if (value) {
							setShippingInfo({
								state: billingInfo!.state,
								isComplete: !!shippingInfo?.isComplete,
							});
						}
						setIsShipToBilling(value);
					}}
					isShipToBilling={isShipToBilling}
					onSubmit={onShippingSubmit}
				/>
			</>

			<AcknowledgementCard
				isActive={step === 'acknowledgements'}
				isComplete={hasAcceptedTerms}
				onToggle={
					shippingInfo?.isComplete
						? (isActive) =>
								setStep(
									isActive
										? 'acknowledgements'
										: hasAcceptedTerms
											? 'payment'
											: 'shipping'
								)
						: undefined
				}
				onSubmit={async () => {
					setHasAcceptedTerms(true);
					setStep('payment');
				}}
			/>

			<PaymentCard
				orderId={orderId}
				orderDetails={orderDetails}
				isReady={
					!!billingInfo?.isComplete && !!shippingInfo?.isComplete && !!hasAcceptedTerms
				}
				isActive={step === 'payment'}
				price={orderDetails?.fullPrice || 0}
				onToggle={
					hasAcceptedTerms
						? (isActive) => setStep(isActive ? 'payment' : 'shipping')
						: undefined
				}
			/>
		</>
	);
}
