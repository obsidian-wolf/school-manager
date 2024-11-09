import clsx from 'clsx';
import { forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';

export const Input = forwardRef<
	HTMLInputElement,
	{
		className?: string;
		placeholder?: string;
		label?: string;
		required?: boolean;
		errorMessage?: string;
		name?: string;
		type?: 'email' | 'password' | 'text';
	} & ReturnType<UseFormRegister<any>>
>(
	(
		{ className, placeholder, type, label, required, errorMessage, name, onChange, onBlur },
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
				<input
					className={clsx(
						'h-10 min-w-0 max-w-full w-full border px-4 rounded-xl transition outline-none',
						{
							'border-red-500': errorMessage,
							'border-white focus:border-primary': !errorMessage,
						},

						className
					)}
					ref={ref}
					placeholder={placeholder}
					type={type}
					onChange={onChange}
					onBlur={onBlur}
					name={name}
				/>
				{errorMessage && <div className="text-sm text-red-500 pt-2">{errorMessage}</div>}
			</label>
		);
	}
);

Input.displayName = 'Input';
