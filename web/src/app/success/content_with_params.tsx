'use client';
import { Button } from '@/components/button';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import SuccessContent, { SuccessRedirect } from './content';

export default function SuccessContentWithParams() {
	const searchParams = useSearchParams();
	const type = searchParams.get('type') as SuccessRedirect | undefined;
	const redirectUrl = searchParams.get('redirectUrl');
	const orderId = searchParams.get('orderId') || undefined;
	const redirectRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (redirectUrl) {
			redirectRef.current = setTimeout(() => {
				window.location.href = redirectUrl;
			}, 5000);
		}
	}, [redirectUrl]);

	function cancelRedirect() {
		if (redirectRef.current) {
			clearTimeout(redirectRef.current);
		}
	}

	return (
		<SuccessContent
			type={type}
			orderId={orderId}
			redirectButton={
				redirectUrl && (
					<div className="pb-8">
						<Button onClick={cancelRedirect} variant="primary" href={redirectUrl}>
							Click here to redirect
						</Button>
					</div>
				)
			}
		/>
	);
}
