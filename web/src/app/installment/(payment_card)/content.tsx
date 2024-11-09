import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LoadingOverlay } from '@/components/loading_overlay';
import { ErrorOverlay } from '@/components/error_overlay';
import { Nexio } from './nexio';

export type PaymentCardContentRef = { triggerSubmit: () => Promise<void> | void };

export type Error = {
	type: string;
	message: string | undefined;
};

export const PaymentCardContent = forwardRef<
	PaymentCardContentRef,
	{ orderId: string; installmentId: string }
>(({ orderId, installmentId }, ref) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | undefined>(undefined);
	const squareInstallmentsRef = useRef<PaymentCardContentRef>({ triggerSubmit: () => {} });

	const beforeunload = useCallback((e: BeforeUnloadEvent) => {
		// Custom message isn't supported by modern browsers anymore.
		// The confirmation dialog will have a standard message.

		e.preventDefault();
		e.returnValue = ''; // This line is necessary for some browsers.
		return '';
	}, []);
	useEffect(() => {
		window.addEventListener('beforeunload', beforeunload);
		return () => {
			window.removeEventListener('beforeunload', beforeunload);
		};
	}, [beforeunload]);

	useImperativeHandle(ref, () => ({
		triggerSubmit: async () => {
			squareInstallmentsRef.current.triggerSubmit();
			return;
		},
	}));

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
			<Nexio
				setError={setError}
				setIsLoading={setIsLoading}
				orderId={orderId}
				installmentId={installmentId}
				ref={squareInstallmentsRef}
			/>
		</>
	);
});

PaymentCardContent.displayName = 'PaymentCardContent';
