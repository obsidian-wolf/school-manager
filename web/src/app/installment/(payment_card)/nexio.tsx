import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { times } from '@/utils/times';
import { NEXIO_URL } from '@/config';
import { Error, PaymentCardContentRef } from './content';
import { getNexioAdHocPaymentUrl, useProcessAdHocNexioPayment } from '@/api/endpoints';

export const Nexio = forwardRef<
	PaymentCardContentRef,
	{
		orderId: string;
		installmentId: string;
		setError: (error: Error | undefined) => void;
		setIsLoading: (isLoading: boolean) => void;
	}
>(({ orderId, installmentId, setError, setIsLoading }, ref) => {
	const [nexioUrl, setNexioUrl] = useState<string | undefined>(undefined);

	const router = useRouter();

	useEffect(() => {
		(async () => {
			const url = await getNexioAdHocPaymentUrl(orderId, {
				installmentId,
			});
			setNexioUrl(url);
		})();
	}, [installmentId, orderId]);

	const processNexioPayment = useProcessAdHocNexioPayment();
	const nexioIframeRef = useRef<HTMLIFrameElement>(null);
	const [iframeLoaded, setIframeLoaded] = useState(false);

	useImperativeHandle(ref, () => ({
		triggerSubmit: async () => {
			const url = NEXIO_URL;
			nexioIframeRef.current!.contentWindow!.postMessage('posted', url);
		},
	}));

	const resetNexio = useCallback(
		async (reset: boolean) => {
			setNexioUrl(undefined);
			const url = await getNexioAdHocPaymentUrl(orderId, {
				installmentId,
				reset,
			});
			setNexioUrl(url);
		},
		[installmentId, orderId]
	);

	const messageListener = useCallback(
		async (event: any) => {
			if (event.origin === NEXIO_URL) {
				if (event?.data?.event === 'submit') {
					setIsLoading(true);
				} else {
					if (event?.data?.event === 'processed') {
						try {
							const successRedirect = await processNexioPayment.mutateAsync({
								orderId,
								params: {
									installmentId,
									nexioPaymentId: event.data.data.id,
								},
							});
							return router.push(successRedirect);
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
		[installmentId, orderId, processNexioPayment, resetNexio, router, setError, setIsLoading]
	);

	useEffect(() => {
		window.addEventListener('message', messageListener);

		return () => {
			window.removeEventListener('message', messageListener);
		};
	}, [messageListener]);

	return (
		<div>
			<div className={clsx('relative h-[400px]')}>
				{(!iframeLoaded || !nexioUrl) && (
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
				{nexioUrl && (
					<div>
						<iframe
							ref={nexioIframeRef}
							src={nexioUrl}
							onLoad={() => setIframeLoaded(true)}
							className="border-none w-full h-[400px] z-[1] bg-[#f9f8f4]"
						></iframe>
					</div>
				)}
			</div>
		</div>
	);
});

Nexio.displayName = 'Nexio';
