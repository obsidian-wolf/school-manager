import clsx from 'clsx';
import { Button } from './button';
import { useState } from 'react';

const CLOSE_DURATION = 300;

export function ErrorOverlay({
	type,
	onClose: _onClose,
	message,
}: {
	type: string | undefined;
	message?: string;
	onClose: () => void;
}) {
	const [isClosing, setIsClosing] = useState(false);

	function onClose() {
		setIsClosing(true);
		setTimeout(() => {
			_onClose();
			setIsClosing(false);
		}, CLOSE_DURATION);
	}

	const isHidden = !type || isClosing;

	return (
		<div
			className={clsx(
				'fixed inset-0 bg-black p-4 bg-opacity-70 flex items-center justify-center z-50 text-white text-xl transition',
				{
					'opacity-0 pointer-events-none': isHidden,
					'opacity-100 pointer-events-auto': !isHidden,
				}
			)}
		>
			<div className="bg-white max-w-xs rounded-2xl text-black w-full p-6 flex flex-col justify-center">
				<div className="mx-auto">
					<svg
						width="50"
						height="60"
						viewBox="0 0 50 60"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M48.1357 28.9901C49.6024 27.5897 50.3458 25.5187 49.8435 23.428C49.3613 21.3373 47.7741 19.7594 45.8452 19.1479C46.5485 17.2742 46.3074 15.0848 44.9411 13.4083C43.5749 11.7318 41.4652 10.9822 39.436 11.2584C39.2551 9.26627 38.0496 7.41223 36.0806 6.46548C34.1116 5.53846 31.8814 5.77515 30.1535 6.87968C29.1088 5.16371 27.2001 4 25.01 4C22.82 4 20.9113 5.16371 19.8665 6.87968C18.1587 5.77515 15.9285 5.53846 13.9596 6.48521C11.9906 7.41223 10.785 9.26627 10.5841 11.2781C8.55486 11.0217 6.44522 11.7515 5.07897 13.428C3.71273 15.1045 3.45154 17.2939 4.15475 19.1677C2.20585 19.7988 0.638685 21.357 0.156482 23.4477C-0.325722 25.5385 0.397583 27.6292 1.86429 29.0099C0.397583 30.4103 -0.345813 32.4813 0.156482 34.572C0.638685 36.6627 2.22594 38.2406 4.15475 38.8521C3.45154 40.7258 3.69264 42.9152 5.05888 44.5917C6.42513 46.2682 8.53477 47.0178 10.564 46.7416C10.7449 48.7337 11.9504 50.5878 13.9194 51.5345C15.8884 52.4615 18.1186 52.2248 19.8465 51.1203C20.8912 52.8363 22.7999 54 24.99 54C27.18 54 29.0887 52.8363 30.1335 51.1203C31.8413 52.2248 34.0714 52.4615 36.0404 51.5148C38.0094 50.5878 39.215 48.7337 39.4159 46.7219C41.4451 46.9783 43.5548 46.2485 44.921 44.572C46.2873 42.8955 46.5485 40.7061 45.8452 38.8323C47.7942 38.2012 49.3613 36.643 49.8435 34.5523C50.3257 32.4615 49.6024 30.3708 48.1357 28.9901Z"
							fill="#F1212A"
						/>
						<path
							d="M22.16 14.4H28.88L28.28 33.52H22.72L22.16 14.4ZM29.28 39C29.28 41.16 27.72 42.44 25.52 42.44C23.28 42.44 21.72 41.16 21.72 39C21.72 36.84 23.28 35.56 25.52 35.56C27.72 35.56 29.28 36.84 29.28 39Z"
							fill="white"
						/>
					</svg>
				</div>
				<div className="text-primary font-semibold text-sm pt-1 border-b border-[#D6D6D6] w-full pb-3 text-center">
					{type === 'nexio' ? 'PAYMENT ERROR' : 'ERROR'}
				</div>
				<div className="py-4 px-2 text-center text-base">
					{type === 'nexio' ? (
						<>
							Your payment details have been declined.
							<div className="text-sm pt-2">{message}</div>
						</>
					) : type === 'square' ? (
						<>
							An error has occurred.
							<div className="text-sm pt-2">{message}</div>
						</>
					) : type === 'nmi' ? (
						<>
							An error has occurred.
							<div className="text-sm pt-2">{message}</div>
						</>
					) : (
						<>
							An error occurred while processing your request.
							<div className="text-sm pt-2">Please try again.</div>
						</>
					)}
				</div>

				<Button onClick={onClose} variant="primary" className="mt-4">
					{type === 'nexio' ? 'Edit Payment' : 'Try again'}
				</Button>
			</div>
		</div>
	);
}
