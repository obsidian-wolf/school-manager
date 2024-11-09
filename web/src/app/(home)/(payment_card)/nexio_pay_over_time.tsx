'use client';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Error, PaymentCardContentRef } from './content';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/format_currency';
import { addMonths, format } from 'date-fns';
import { CalendarDateRangeIcon } from '@heroicons/react/16/solid';
import { Checkbox } from '@/components/checkbox';
import clsx from 'clsx';
import { Button } from '@/components/button';
import { NEXIO_URL } from '@/config';
import { times } from '@/utils/times';
import { getNexioPayOverTimePaymentUrl, useProcessNexioPayOverTimePayment } from '@/api/endpoints';

export const NexioPayOverTime = forwardRef<
	PaymentCardContentRef,
	{
		orderId: string;
		setError: (error: Error | undefined) => void;
		setIsLoading: (isLoading: boolean) => void;
		isActive: boolean;
		payOverTimePlan: number[];
	}
>(({ orderId, setError, setIsLoading, isActive, payOverTimePlan }, ref) => {
	const [nexioInstallmentUrl, setNexioUrl] = useState<string | undefined>(undefined);
	const router = useRouter();

	useEffect(() => {
		(async () => {
			const url = await getNexioPayOverTimePaymentUrl(orderId);
			setNexioUrl(url);
		})();
	}, [orderId]);

	const [paymentTerms, setPaymentTerms] = useState(false);
	const [paymentObligation, setPaymentObligation] = useState(false);
	const [hasProceeded, setHasProceeded] = useState(false);

	const processNexioPayment = useProcessNexioPayOverTimePayment();
	const nexioIframeRef = useRef<HTMLIFrameElement>(null);
	const [iframeLoaded, setIframeLoaded] = useState(false);

	useImperativeHandle(ref, () => ({
		triggerSubmit: async () => {
			if (isActive) {
				nexioIframeRef.current!.contentWindow!.postMessage('posted', NEXIO_URL);
			}
		},
	}));

	const resetNexio = useCallback(
		async (reset: boolean) => {
			setNexioUrl(undefined);
			const url = await getNexioPayOverTimePaymentUrl(orderId, {
				reset,
			});
			setNexioUrl(url);
		},
		[orderId]
	);

	const messageListener = useCallback(
		async (event: any) => {
			if (isActive && event.origin === NEXIO_URL) {
				if (event?.data?.event === 'submit') {
					setIsLoading(true);
				} else {
					if (event?.data?.event === 'processed') {
						try {
							const successRedirect = await processNexioPayment.mutateAsync({
								orderId,
								params: {
									nexioPaymentId: event.data.data.id,
								},
							});
							router.push(successRedirect);
						} catch {
							router.push(
								`/error?type=${encodeURIComponent('Please contact us to complete your order.')}`
							);
						}
					} else if (event?.data?.event === 'error') {
						setError({
							type: 'nexio',
							message:
								event?.data?.data?.message ||
								'Please verify your information or choose another payment option.',
						});
						resetNexio(true);
					}
					setIsLoading(false);
				}
				// console.log('event', event);
				// switch on event.data properties
				// (e.g. loaded, formValidations, error)
			}
		},
		[isActive, orderId, processNexioPayment, resetNexio, router, setError, setIsLoading]
	);

	useEffect(() => {
		window.addEventListener('message', messageListener);

		return () => {
			window.removeEventListener('message', messageListener);
		};
	}, [messageListener]);

	const is2 = payOverTimePlan.length === 2;

	return (
		<>
			<h4 className="text-lg font-semibold pt-5">
				PAYMENT SCHEDULE
				<CalendarDateRangeIcon className="h-6 w-6 inline-block ml-5 text-[#FA5B4C]" />
			</h4>
			<div className="flex flex-col pt-5 sm:pt-8 w-auto sm:w-[600px] mx-auto pb-8">
				<div
					className={clsx(
						'mx-auto font-medium relative h-[42px] sm:h-[60px] z-0 w-full',
						{
							'sm:w-[260px]': is2,
							'sm:w-[280px]': !is2,
						}
					)}
				>
					<div
						className={clsx(
							'hidden sm:block border-t border-x border-[#FA5B4C] absolute top-[30px] h-[63px] z-[-1]',
							{
								'left-[-27px] right-[-27px]': is2,
								'left-[-67px] right-[-67px]': !is2,
							}
						)}
					></div>

					{!is2 && (
						<div
							className={clsx(
								'hidden sm:block w-[1px] h-[33px] bg-[#FA5B4C] absolute top-[60px] left-[50%] transform -translate-x-1/2 z-[-1]',
								{}
							)}
						></div>
					)}

					<div
						className={clsx(
							'sm:hidden w-[1px] bg-[#FA5B4C] absolute top-[30px] left-[40px] z-[-1]',
							{
								'h-[200px]': is2,
								'h-[300px]': !is2,
							}
						)}
					></div>

					<div className="h-full flex items-center bg-white border border-[#FA5B4C] z-10 text-center justify-center">
						TOTAL TO BE PAID:{' '}
						<span className="text-[#FA5B4C] font-semibold pl-2">
							{formatCurrency(payOverTimePlan.reduce((acc, i) => acc + i, 0))}
						</span>
					</div>
				</div>
				<div className="flex sm:items-center pt-8 gap-6 sm:flex-row flex-col z-20">
					{payOverTimePlan?.map((amount, month) => (
						<div
							key={month}
							className="flex flex-row sm:flex-col items-center sm:flex-1 sm:h-[200px]"
						>
							<div className="font-semibold min-h-[80px] max-h-[80px] min-w-[80px] max-w-[80px] flex items-center justify-center bg-white rounded-full border border-[#FA5B4C] text-[#FA5B4C]">
								{formatCurrency(amount)}
							</div>
							<div className="pl-5 sm:pl-0 flex-1">
								<div className="text-sm font-semibold sm:text-center sm:pt-3">
									Payment {month + 1}
								</div>
								<div className="text-xs sm:text-sm sm:text-center pt-1">
									{month === 0 ? (
										<>
											Due right now before
											<br className="hidden sm:inline-block" /> submitting
											order.
											<br />
											<span className="font-medium pt-1">
												{/* american date format */}
												{format(new Date(), 'M/d/yyyy')}
											</span>
										</>
									) : (
										<>
											Automatically <br className="hidden sm:inline-block" />
											deducted on
											<br />
											<span className="text-[#FA5B4C] font-medium pt-1">
												{format(addMonths(new Date(), month), 'M/d/yyyy')}
											</span>
										</>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<h5 className="font-medium pb-4"> Ellie Payment Plan Agreements </h5>
			<div className="flex-col flex gap-4">
				<Checkbox
					label="Payment Terms & Conditions"
					subtitle={
						<>
							I agree with{' '}
							<a
								href="https://elliemd.com/payment-plan-terms/"
								target="_blank"
								className="underline text-[#3700FF]"
							>
								Ellie Payment Plan Terms and Conditions
							</a>{' '}
							and authorize EllieMD LLC and its payment processors to charge my
							selected payment method for each of the three installments on the
							scheduled dates.
						</>
					}
					checked={paymentTerms}
					onChange={(c) => {
						setPaymentTerms(c);
						setHasProceeded(false);
					}}
				/>
				<Checkbox
					label="Payment Obligation "
					subtitle="I understand that I am obligated to make all three installment payments and failure to do so may result in additional fees, collection activities, and potential impact on my credit rating. This purchase is non-returnable and non-refundable. "
					checked={paymentObligation}
					onChange={(c) => {
						setPaymentObligation(c);
						setHasProceeded(false);
					}}
				/>
				{!hasProceeded && (
					<div className="sm:mx-auto pt-4 pb-2 flex flex-col">
						<Button
							variant="primary"
							disabled={!paymentTerms || !paymentObligation}
							onClick={() => {
								setHasProceeded(true);
							}}
						>
							Proceed to payment
						</Button>
					</div>
				)}
			</div>
			<div
				className={clsx('relative', {
					'h-0 invisible': !hasProceeded,
					'mt-10 h-[400px]': hasProceeded,
				})}
			>
				{(!iframeLoaded || !nexioInstallmentUrl) && (
					<div className="flex flex-col gap-5 absolute inset-0 z-[0]">
						{times(8, (i) => (
							<div
								key={i}
								className={clsx('h-7 bg-black bg-opacity-10 animate-pulse rounded')}
								style={{
									width: i % 2 === 0 ? '50%' : '100%',
								}}
							/>
						))}
					</div>
				)}
				{nexioInstallmentUrl && (
					<div>
						<iframe
							ref={nexioIframeRef}
							src={nexioInstallmentUrl}
							onLoad={() => setIframeLoaded(true)}
							className="border-none w-full h-[400px] z-[1] bg-[#f9f8f4]"
						></iframe>
					</div>
				)}
			</div>
		</>
	);
});

NexioPayOverTime.displayName = 'NexioPayOverTime';
