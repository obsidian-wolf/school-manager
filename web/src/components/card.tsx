import clsx from 'clsx';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<section className={clsx('w-full rounded-2xl p-5 md:px-8 z-10', className)}>
			{children}
		</section>
	);
}
