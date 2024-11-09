import clsx from 'clsx';
import { ReactNode } from 'react';

export function Section({
	children,
	className,
	backgroundColor,
	background,
	backgroundColorLeft,
	backgroundColorRight,
}: {
	children: ReactNode;
	className?: string;
	backgroundColor?: string;
	background?: ReactNode;
	backgroundColorLeft?: string;
	backgroundColorRight?: string;
}) {
	return (
		<section className={clsx(backgroundColor, 'flex justify-center relative')}>
			{backgroundColorLeft && (
				<div
					className={clsx(
						'absolute right-[50%] left-0 top-0 bottom-0 z-0',
						backgroundColorLeft
					)}
				></div>
			)}
			{backgroundColorRight && (
				<div
					className={clsx(
						'absolute left-[50%] right-0 top-0 bottom-0 z-0',
						backgroundColorRight
					)}
				></div>
			)}
			{background && <div className="absolute inset-0">{background}</div>}
			<div className={clsx(className, 'flex w-full max-w-screen-2xl z-10')}>{children}</div>
		</section>
	);
}
