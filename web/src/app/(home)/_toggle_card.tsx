import React from 'react';
import { Card } from '@/components/card';
import clsx from 'clsx';
import { ChevronUpIcon } from '@heroicons/react/16/solid';
import { times } from '@/utils/times';

export function ToggleCard({
	title,
	isComplete,
	isActive,
	onToggle,
	children,
}: {
	title: string;
	isComplete: boolean;
	isActive: boolean;
	onToggle?: (isActive: boolean) => void;
	children?: React.ReactNode;
}) {
	return (
		<Card className={clsx('bg-[#f9f8f4] mt-8 sm:mt-12 overflow-hidden')}>
			<div className="flex justify-between items-center">
				<h2 className="text-lg md:text-2xl font-semibold uppercase">{title}</h2>
				<div className="flex items-center gap-2">
					{isComplete && (
						<svg
							width="37"
							height="37"
							viewBox="0 0 37 37"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M35.6204 18.4927C36.7058 17.4564 37.2559 15.9239 36.8842 14.3767C36.5274 12.8296 35.3528 11.6619 33.9255 11.2095C34.4459 9.82288 34.2674 8.20276 33.2564 6.96213C32.2454 5.7215 30.6843 5.16686 29.1826 5.3712C29.0488 3.89704 28.1567 2.52505 26.6997 1.82446C25.2426 1.13846 23.5923 1.31361 22.3136 2.13097C21.5405 0.861144 20.128 0 18.5074 0C16.8868 0 15.4744 0.861144 14.7012 2.13097C13.4375 1.31361 11.7871 1.13846 10.3301 1.83905C8.87301 2.52505 7.98094 3.89704 7.83226 5.3858C6.33059 5.19606 4.76946 5.73609 3.75844 6.97673C2.74742 8.21736 2.55414 9.83748 3.07452 11.2241C1.63233 11.6911 0.472627 12.8442 0.115797 14.3913C-0.241034 15.9385 0.294212 17.4856 1.37957 18.5073C0.294212 19.5436 -0.255902 21.0761 0.115797 22.6233C0.472627 24.1704 1.64719 25.3381 3.07452 25.7905C2.55414 27.1771 2.73255 28.7972 3.74357 30.0379C4.75459 31.2785 6.31573 31.8331 7.81739 31.6288C7.9512 33.103 8.84328 34.475 10.3003 35.1755C11.7574 35.8615 13.4077 35.6864 14.6864 34.869C15.4595 36.1389 16.872 37 18.4926 37C20.1132 37 21.5256 36.1389 22.2988 34.869C23.5625 35.6864 25.2129 35.8615 26.6699 35.1609C28.127 34.475 29.0191 33.103 29.1677 31.6142C30.6694 31.8039 32.2305 31.2639 33.2416 30.0233C34.2526 28.7826 34.4459 27.1625 33.9255 25.7759C35.3677 25.3089 36.5274 24.1558 36.8842 22.6087C37.241 21.0615 36.7058 19.5144 35.6204 18.4927Z"
								fill="#65C3C3"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M29 14.6695L16.4906 28L8 20.7913L10.2394 17.8364L16.2194 22.9135L26.4607 12L29 14.6695Z"
								fill="white"
							/>
						</svg>
					)}
					<button
						onClick={() => onToggle?.(!isActive)}
						className={clsx(
							'rounded-full p-2 flex items-center justify-center bg-black bg-opacity-0 transition',
							{
								'hover:bg-opacity-5': onToggle,
								'cursor-not-allowed': !onToggle,
							}
						)}
					>
						<ChevronUpIcon
							className={clsx('h-5 text-primary transition', {
								'rotate-180': !isActive,
							})}
						/>
					</button>
				</div>
			</div>
			<div
				className={clsx('transition-all', {
					'invisible h-0 opacity-0': !isActive,
					'h-fit py-4': isActive,
				})}
			>
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
