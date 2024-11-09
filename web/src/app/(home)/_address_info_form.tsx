'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { US_STATE_CODES, US_STATES } from '@/utils/states';
import { Button } from '@/components/button';
import { z } from 'zod';
import { Address } from '@/api/model';

const FormSchema = z.object({
	address: z.string().min(1, { message: 'Address is required' }),
	city: z.string().min(1, { message: 'City is required' }),
	email: z.string().email(),
	firstName: z.string().min(1, { message: 'First name is required' }),
	lastName: z.string().min(1, { message: 'Last name is required' }),
	middleName: z.string().optional(),
	phone: z.string().min(1, { message: 'Phone is required' }),
	postcode: z.string().min(1, { message: 'Postcode is required' }),
	stateCode: z.enum(US_STATE_CODES, { message: 'State is required' }),
});

export function AddressInfoForm({
	addressInfo,
	onSubmit: _onSubmit,
	buttonLabel,
}: {
	addressInfo: Address;
	onSubmit: (data: Address) => Promise<void>;
	buttonLabel: string;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Address>({
		defaultValues: addressInfo,
		resolver: zodResolver(FormSchema),
	});

	const [loading, setLoading] = React.useState(false);

	async function onSubmit(data: Address) {
		setLoading(true);
		try {
			await _onSubmit(data);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className={clsx('flex flex-col gap-4')} onSubmit={handleSubmit(onSubmit)}>
			<Input
				label="Email address"
				{...register('email')}
				required
				errorMessage={errors.email?.message}
			/>
			<div className="flex gap-4 flex-col md:flex-row">
				<Input
					label="First Name"
					{...register('firstName')}
					required
					errorMessage={errors.firstName?.message}
				/>
				<Input
					label="Middle Name"
					{...register('middleName')}
					errorMessage={errors.middleName?.message}
				/>
			</div>
			<div className="flex gap-4 flex-col md:flex-row">
				<Input
					label="Last Name"
					{...register('lastName')}
					required
					errorMessage={errors.lastName?.message}
				/>
				<Input
					label="Phone"
					{...register('phone')}
					required
					errorMessage={errors.phone?.message}
				/>
			</div>
			<Input
				label="Street address"
				{...register('address')}
				errorMessage={errors.address?.message}
				required
			/>
			<div className="flex gap-4 flex-col md:flex-row">
				<Input
					label="City"
					{...register('city')}
					required
					errorMessage={errors.city?.message}
				/>
				<Select
					label="State"
					{...register('stateCode')}
					options={[{ value: '', label: 'Select State' }, ...US_STATES]}
					required
					errorMessage={errors.stateCode?.message}
				/>
			</div>
			<div className="flex gap-4 flex-col md:flex-row">
				<Input
					label="Postcode"
					{...register('postcode')}
					errorMessage={errors.postcode?.message}
					required
				/>
				<div className="w-full" />
			</div>
			<Button variant="primary" className="mt-4" type="submit" loading={loading}>
				{buttonLabel}
			</Button>
		</form>
	);
}
