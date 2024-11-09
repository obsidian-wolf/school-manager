import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { PaymentCardContentRef } from './content';
import { Checkbox } from '@/components/checkbox';
import { getAfterpayCheckoutUrl } from '@/api/endpoints';

export const AfterPay = forwardRef<
	PaymentCardContentRef,
	{
		orderId: string;
		cancelAfterPay: () => void;
	}
>(({ orderId, cancelAfterPay }, ref) => {
	const [afterpayUrl, setAfterpayUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		(async () => {
			try {
				setAfterpayUrl(await getAfterpayCheckoutUrl(orderId));
			} catch {
				cancelAfterPay();
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderId]);

	useImperativeHandle(ref, () => ({
		triggerSubmit: async () => {
			window.location.href = afterpayUrl!;
		},
	}));

	return (
		<div>
			<div className="font-semibold text-sm pb-2">Pay In Installments Options</div>
			<div className="flex justify-between items-center h-12 border-b border-gray-300">
				<div className="flex-1">
					<Checkbox
						checked={true}
						label={<span className="font-normal">AfterPay</span>}
						onChange={() => {
							//
						}}
					/>
				</div>
				<img src="/afterpay.png" alt="AfterPay" />
			</div>
			<div className="flex justify-between items-center h-12 border-b border-gray-300">
				<div className="flex-1">
					<Checkbox
						checked={false}
						label={<span className="font-normal">PayPal Pay Later </span>}
						disabled
						onChange={() => {
							//
						}}
					/>
				</div>
				<img src="/paypal.png" alt="Paypal" />
			</div>
			<div className="flex justify-between items-center h-12 border-b border-gray-300">
				<div className="flex-1">
					<Checkbox
						checked={false}
						label={<span className="font-normal">Klarna</span>}
						disabled
						onChange={() => {
							//
						}}
					/>
				</div>
				<img src="/klarna.png" alt="Klarna" />
			</div>
		</div>
	);
});

AfterPay.displayName = 'AfterPay';
