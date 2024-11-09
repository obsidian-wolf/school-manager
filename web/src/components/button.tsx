import clsx from 'clsx';
import Link from 'next/link';

export function Button({
	children,
	href,
	className: externalClassName,
	variant,
	onClick,
	loading,
	type = 'button',
	disabled,
}: {
	children: React.ReactNode;
	href?: string;
	className?: string;
	variant: 'primary' | 'secondary' | 'outline-inverted' | 'outline';
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	loading?: boolean;
	disabled?: boolean;
}) {
	const className = clsx(
		'rounded-full border px-5 inline-flex items-center transition-all h-12 justify-center min-w-[120px]',
		externalClassName,
		{
			'text-white': variant === 'primary',
			'bg-[#EEEEEE]': variant === 'primary' && disabled,
			'bg-primary hover:bg-secondary hover:border-secondary active:bg-opacity-80 border-primary':
				variant === 'primary' && !disabled,
			'bg-secondary hover:bg-primary text-white border-secondary hover:border-primary active:bg-opacity-80':
				variant === 'secondary',
			'hover:bg-white text-white border-white hover:text-primary active:bg-opacity-80 focus:outline-white':
				variant === 'outline-inverted',
			'border-body text-body hover:bg-secondary hover:text-white hover:border-secondary active:bg-opacity-80':
				variant === 'outline',
		}
	);
	if (href) {
		return (
			<Link href={href} className={className} onClick={onClick}>
				{children}
			</Link>
		);
	}
	return (
		<button className={className} type={type} onClick={onClick} disabled={loading || disabled}>
			{loading ? 'Loading...' : children}
		</button>
	);
}
