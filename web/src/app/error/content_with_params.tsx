'use client';
import { useSearchParams } from 'next/navigation';
import { ErrorContent } from './content';

export function ErrorContentWithParams() {
	const searchParams = useSearchParams();
	const redirectUrl = searchParams.get('redirectUrl') || undefined;
	const type = searchParams.get('type') as string | undefined;

	return <ErrorContent type={type} redirectUrl={redirectUrl} />;
}
