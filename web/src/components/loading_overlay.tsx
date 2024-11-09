import clsx from 'clsx';

export function LoadingOverlay({
	isOpen,
	children = 'Processing your payment...',
}: {
	isOpen: boolean;
	children?: React.ReactNode;
}) {
	return (
		<div
			className={clsx(
				'fixed inset-0 bg-black px-4 bg-opacity-70 flex items-center justify-center z-50 text-white text-xl py-4',
				{
					'opacity-0 pointer-events-none': !isOpen,
					'opacity-100 pointer-events-auto': isOpen,
				}
			)}
		>
			<div className="bg-[#FFD3C7] max-w-sm rounded-2xl text-black w-full py-8 px-4 text-center flex flex-col">
				<img src="/home/elephant-2.svg" className="h-32 floating" alt="elephant" />
				<div className="text-primary font-semibold pt-8">{children}</div>
			</div>
		</div>
	);
}
