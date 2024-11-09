import clsx from 'clsx';
import { forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';

export const Select = forwardRef<
	HTMLSelectElement,
	{
		className?: string;
		placeholder?: string;
		label?: string;
		required?: boolean;
		errorMessage?: string;
		name?: string;
		value?: string;
		options: { value: string; label: string }[];
	} & ReturnType<UseFormRegister<any>>
>(
	(
		{ className, placeholder, label, required, options, name, errorMessage, onChange, onBlur },
		ref
	) => {
		return (
			<label className="block w-full">
				{label && (
					<div className="text-sm pb-2 font-semibold">
						{label}
						{required && <span className="text-primary">*</span>}
					</div>
				)}
				<select
					className={clsx(
						'h-10 min-w-0 max-w-full w-full border px-4 rounded-xl',
						{
							'border-red-500': errorMessage,
							'border-white focus:border-primary': !errorMessage,
						},
						className
					)}
					ref={ref}
					onBlur={onBlur}
					name={name}
					onChange={onChange}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{errorMessage && <div className="text-sm text-red-500 pt-2">{errorMessage}</div>}
			</label>
		);
	}
);

Select.displayName = 'Select';
