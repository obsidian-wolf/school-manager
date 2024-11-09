import React from 'react';
import { Card } from '@/components/card';
import clsx from 'clsx';
import { times } from '@/utils/times';

export function ToggleCard({ title, children }: { title: string; children?: React.ReactNode }) {
	return (
		<Card className={clsx('bg-[#f9f8f4] mt-8 sm:mt-12 overflow-hidden')}>
			<div className="flex justify-between items-center">
				<h2 className="text-lg md:text-2xl font-semibold uppercase">{title}</h2>
				<div className="flex items-center gap-2"></div>
			</div>
			<div className={clsx('transition-all h-fit pt-4')}>
				{children || (
					<div className="flex flex-col gap-4">
						{times(4, (i) => (
							<div
								key={i}
								className={clsx('h-4 bg-black bg-opacity-10 animate-pulse rounded')}
								style={{
									width: i % 2 === 0 ? '50%' : '100%',
								}}
							/>
						))}
					</div>
				)}
			</div>
		</Card>
	);
}
