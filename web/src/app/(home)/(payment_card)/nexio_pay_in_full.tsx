import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { times } from '@/utils/times';
import { NEXIO_URL } from '@/config';
import { Error, PaymentCardContentRef } from './content';
import { getNexioPayInFullPaymentUrl, useProcessNexioPayInFullPayment } from '@/api/endpoints';

export const NexioPayInFull = forwardRef<
	PaymentCardContentRef,
	{
		orderId: string;
		setError: (error: Error | undefined) => void;
		setIsLoading: (isLoading: boolean) => void;
		isActive: boolean;
	}
>(({ orderId, setError, setIsLoading, isActive }, ref) => {
	const [nexioUrl, setNexioUrl] = useState<string | undefined>(undefined);

	const router = useRouter();

	useEffect(() => {
		(async () => {
			const url = await getNexioPayInFullPaymentUrl(orderId);
			setNexioUrl(url);
		})();
	}, [orderId]);

	const processNexioPayment = useProcessNexioPayInFullPayment();
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
			const url = await getNexioPayInFullPaymentUrl(orderId, {
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
						setIsLoading(false);
					}
				}
				// console.log('event', event.data?.event);
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

NexioPayInFull.displayName = 'NexioPayInFull';
