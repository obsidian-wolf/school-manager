'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ErrorOverlay } from '@/components/error_overlay';
import ProductCard from './_product_card';
import { getAdHocOrderInstallment } from '@/api/endpoints';
import { OrderInstallmentDetails } from '@/api/model';
import { PaymentCard } from './(payment_card)';

export default function InstallmentsContent() {
	const [isError, setIsError] = React.useState<string | undefined>(undefined);
	const searchParams = useSearchParams();
	const router = useRouter();
	const orderId = searchParams.get('orderId')!;
	const installmentId = searchParams.get('installmentId')!;

	const [details, setDetails] = useState<OrderInstallmentDetails | undefined>(undefined);

	useEffect(() => {
		(async () => {
			try {
				const response = await getAdHocOrderInstallment(orderId, {
					installmentId,
				});

				setDetails(response);
			} catch {
				router.push(`/error?type=already_processed`);
			}
		})();
	}, [installmentId, orderId, router]);

	const { amount, product, installmentIndex } = details ?? {};

	if (!orderId || !installmentId) {
		return null;
	}

	return (
		<>
			<ErrorOverlay type={isError} onClose={() => setIsError(undefined)} />

			{amount && (
				<>
					<ProductCard product={product} index={installmentIndex} amount={amount} />
					<PaymentCard installmentId={installmentId} orderId={orderId} />
				</>
			)}
		</>
	);
}
