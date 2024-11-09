import clsx from 'clsx';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LoadingOverlay } from '@/components/loading_overlay';
import { ErrorOverlay } from '@/components/error_overlay';
import { Checkbox } from '@/components/checkbox';
import { AfterPay } from './afterpay';
import { formatCurrency } from '@/utils/format_currency';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import ellieInstallmentsBanner1 from './ellie_installments_banner_1';
import ellieInstallmentsBanner2 from './ellie_installments_banner_2';
import { NexioPayInFull } from './nexio_pay_in_full';
import { NexioPayOverTime } from './nexio_pay_over_time';
import { OrderDetails } from '@/api/model';

export type PaymentCardContentRef = { triggerSubmit: () => Promise<void> | void };

function BoxButton({
	children,
	onClick,
	isActive,
}: {
	children: React.ReactNode;
	onClick: () => void;
	isActive: boolean;
}) {
	return (
		<div>
			<Checkbox checked={isActive} onChange={onClick} label={children} />
		</div>
	);
}

export type Error = {
	type: string;
	message: string | undefined;
};

export const PaymentCardContent = forwardRef<
	PaymentCardContentRef,
	{
		orderId: string;
		price: number;
		orderDetails: OrderDetails;
		isLoading: boolean;
		setIsLoading: (isLoading: boolean) => void;
	}
>(({ orderId, price, orderDetails, isLoading, setIsLoading }, ref) => {
	const [error, setError] = useState<Error | undefined>(undefined);
	const nexioPayInFullRef = useRef<PaymentCardContentRef>({ triggerSubmit: () => {} });
	const afterpayRef = useRef<PaymentCardContentRef>({ triggerSubmit: () => {} });
	const nexioPayOverTimeRef = useRef<PaymentCardContentRef>({ triggerSubmit: () => {} });

	const [hasCancelledAfterpay, _setHasCancelledAfterpay] = useState(false);
	function setHasCancelledAfterpay(value: boolean) {
		_setHasCancelledAfterpay(value);
		if (value) {
			setPayOption('nexio-pay-in-full');
		}
	}
	const [payOption, setPayOption] = useState<
		'afterpay' | 'nexio-pay-over-time' | 'nexio-pay-in-full'
	>('afterpay');

	const [hasSubmitted, setHasSubmitted] = useState(false);

	const beforeunload = useCallback(
		(e: BeforeUnloadEvent) => {
			// Custom message isn't supported by modern browsers anymore.
			// The confirmation dialog will have a standard message.
			if (!hasSubmitted && payOption !== 'afterpay') {
				e.preventDefault();
				e.returnValue = ''; // This line is necessary for some browsers.
				return '';
			}
		},
		[hasSubmitted, payOption]
	);

	useEffect(() => {
		window.addEventListener('beforeunload', beforeunload);
		return () => {
			window.removeEventListener('beforeunload', beforeunload);
		};
	}, [beforeunload]);

	useImperativeHandle(ref, () => ({
		triggerSubmit: async () => {
			if (payOption === 'afterpay') {
				afterpayRef.current.triggerSubmit();
				setHasSubmitted(true);
				return;
			}
			if (payOption === 'nexio-pay-in-full') {
				nexioPayInFullRef.current.triggerSubmit();
				setHasSubmitted(true);
				return;
			}
			if (payOption === 'nexio-pay-over-time') {
				nexioPayOverTimeRef.current.triggerSubmit();
				setHasSubmitted(true);
				return;
			}
		},
	}));

	const isAllInstallments = orderDetails.products.every((e) => e.payOverTimePlan);
	const monthlyPrice = isAllInstallments ? orderDetails.payOverTimePlan[0] : undefined;

	return (
		<>
			<LoadingOverlay isOpen={isLoading} />
			<ErrorOverlay
				onClose={() => {
					setError(undefined);
				}}
				message={error?.message}
				type={error?.type}
			/>
			<div className="text-lg">Select a Payment Option:</div>
			<div className="flex flex-col gap-4 pt-5">
				{!hasCancelledAfterpay && (
					<>
						<BoxButton
							onClick={() => setPayOption('afterpay')}
							isActive={payOption === 'afterpay'}
						>
							<div className="pl-2 flex items-center">
								<div className="flex-1">
									<span className="tracking-tighter">
										Buy Now Pay Later Options
									</span>
									<div className="font-normal text-sm pt-2">
										Make several partial payments over a period of time through
										one of our financing partners.{' '}
										<strong className="font-semibold">
											No credit check required.
										</strong>{' '}
										The terms, interest rate, and details will be determined by
										3rd party. There is no guarantee you will be approved.
									</div>
								</div>
								<div className="pl-6 pr-3 whitespace-nowrap text-right gap-2">
									<div className="text-xs">As low as</div>
									<div className="text-[#006666]">
										{formatCurrency(Number((price * 0.1).toFixed(0)))}/
										<span className="text-sm">month</span>
									</div>
								</div>
								<ChevronDownIcon
									className={clsx('hidden sm:flex h-6 transition-all', {
										'rotate-180': payOption === 'afterpay',
									})}
								/>
							</div>
						</BoxButton>

						<div
							className={clsx('py-4 sm:pl-10 sm:pr-4 relative', {
								hidden: payOption !== 'afterpay',
							})}
						>
							<AfterPay
								orderId={orderId}
								ref={afterpayRef}
								cancelAfterPay={() => setHasCancelledAfterpay(true)}
							/>
						</div>
					</>
				)}

				{orderDetails.payOverTimePlan?.length > 1 && (
					<>
						<div className="w-full h-[1px] my-2 bg-[#9D9D9D]" />
						<BoxButton
							onClick={() => setPayOption('nexio-pay-over-time')}
							isActive={payOption === 'nexio-pay-over-time'}
						>
							<div className="pl-2 flex items-center">
								<div className="flex-1">
									<span className="tracking-tighter">
										Ellie Payment Plan{' '}
										<span className="font-normal">
											- Pay In 3 Installments (0%)
										</span>
									</span>
									<div className="font-normal text-sm pt-2">
										First payment due now. Subsequent payments are automatically
										charged monthly.{' '}
										<strong className="font-semibold">
											No credit check required.
										</strong>
									</div>
								</div>
								<div>
									<div className="flex justify-end pb-1">
										<div className="pl-5 md:pl-10 pr-3 whitespace-nowrap text-right gap-2">
											<div className="text-xs">
												{monthlyPrice ? 'Monthly Price' : 'Total Price'}
											</div>
											<div className="text-[#FA5B4C]">
												{formatCurrency(
													monthlyPrice || orderDetails.fullPrice
												)}
											</div>
										</div>
										<ChevronDownIcon
											className={clsx('hidden sm:flex h-6 transition-all', {
												'rotate-180': payOption === 'nexio-pay-over-time',
											})}
										/>
									</div>
									{ellieInstallmentsBanner1}
								</div>
							</div>
						</BoxButton>
						{ellieInstallmentsBanner2}
						<div
							className={clsx('pb-10 relative', {
								hidden: payOption !== 'nexio-pay-over-time',
							})}
						>
							<NexioPayOverTime
								setError={setError}
								isActive={payOption === 'nexio-pay-over-time'}
								setIsLoading={setIsLoading}
								orderId={orderId}
								ref={nexioPayOverTimeRef}
								payOverTimePlan={orderDetails.payOverTimePlan}
							/>
						</div>
					</>
				)}

				<>
					<div className="w-full h-[1px] my-2 bg-[#9D9D9D]" />

					<BoxButton
						onClick={() => setPayOption('nexio-pay-in-full')}
						isActive={payOption === 'nexio-pay-in-full'}
					>
						<div className="pl-2 flex items-center">
							<div className="flex-1">
								<span className="tracking-tighter">Pay In Full</span>
								<div className="font-normal text-sm pt-2">
									Make one payment for the full amount of your cart now with
									Credit, Debit, FSA, or HSA.
								</div>
							</div>
							<div className="pl-5 md:pl-10 pr-3 whitespace-nowrap text-right gap-2">
								<div className="text-xs">Total Price</div>
								<div className="text-[#006666]">{formatCurrency(price)}</div>
							</div>
							<ChevronDownIcon
								className={clsx('hidden sm:flex h-6 transition-all', {
									'rotate-180': payOption === 'nexio-pay-in-full',
								})}
							/>
						</div>
					</BoxButton>

					<div
						className={clsx('py-4 sm:pl-10 sm:pr-4 relative', {
							hidden: payOption !== 'nexio-pay-in-full',
						})}
					>
						<NexioPayInFull
							setError={setError}
							setIsLoading={setIsLoading}
							orderId={orderId}
							ref={nexioPayInFullRef}
							isActive={payOption === 'nexio-pay-in-full'}
						/>
					</div>
				</>
			</div>
		</>
	);
});

PaymentCardContent.displayName = 'PaymentCardContent';
