import clsx from 'clsx';

export function Checkbox({
	label,
	subtitle,
	checked,
	disabled,
	onChange,
}: {
	label: React.ReactNode;
	subtitle?: React.ReactNode;
	checked: boolean;
	disabled?: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<label
			className={clsx('flex gap-4 font-semibold group w-full', {
				'items-center': !subtitle,
				'cursor-pointer': !disabled,
				'text-gray-400': disabled,
			})}
		>
			<div
				className={clsx(
					'h-5 min-w-[20px] max-w-[20px] rounded-full border flex items-center justify-center group-hover:bg-opacity-90 transition',
					{
						'bg-primary': checked,
						'bg-transparent': !checked,
						'mt-2': subtitle,
						'border-primary': !disabled,
						'border-gray-400': disabled,
					}
				)}
			>
				{/* <CheckIcon
					className={clsx('h-5 w-5 text-white transition', {
						'opacity-0': !checked,
						'opacity-100': checked,
					})}
				/> */}
			</div>
			<div className="flex-1">
				{label}
				{subtitle && <div className="text-xs font-normal">{subtitle}</div>}
			</div>
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="invisible h-0 w-0"
			/>
		</label>
	);
}
