'use client';
import { format, addDays } from 'date-fns';

import DatePicker from '@/components/datepicker';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/button';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateSyncAppointment, useGetAppointments } from '@/api/endpoints';
import { WEBSITE_URL } from '@/config';
import { AvailableSlot, RecordStringAvailableSlotArray } from '@/api/model';

export default function AppointmentContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const orderId = searchParams.get('orderId')!;
	const type = searchParams.get('type');

	const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);

	const { data, isError } = useGetAppointments(orderId);
	const createAppointment = useCreateSyncAppointment();

	const { unavailableDates, availableDates, minDate, maxDate } = useMemo(() => {
		const availableDates: Record<string, AvailableSlot[]> = {};
		if (data) {
			for (const date in data) {
				const availableSlots = (data as RecordStringAvailableSlotArray)[date];
				if (availableSlots?.length > 0) {
					availableDates[date] = availableSlots;
				}
			}
		}

		let dates = Object.keys(availableDates).map((date) => new Date(date));

		dates = dates.sort((a, b) => a.getTime() - b.getTime());

		const minDate = dates[0];
		const maxDate = dates[dates.length - 1];
		// get unavailable dates between the first and last available date
		const unavailableDates = [];
		let date = minDate;
		while (date < maxDate) {
			const df = format(date, 'yyyy-MM-dd');
			if (!availableDates[df]) {
				unavailableDates.push(date);
			}
			date = addDays(date, 1);
		}
		return { unavailableDates, minDate, maxDate, availableDates };
	}, [data]);

	const [date, setDate] = useState<Date>(new Date());

	const availableAppointmentDateCount = Object.keys(availableDates).length;

	useEffect(() => {
		if (data && availableAppointmentDateCount === 0) {
			router.push(
				`${WEBSITE_URL}/payment-confirmation/?payment_status=success&orderId=${orderId}&no_appointments=true`
			);
		}
	}, [data, availableAppointmentDateCount, router, orderId, type]);

	async function handleSelect() {
		if (!selectedSlot) return;

		const availableSlot = (data as RecordStringAvailableSlotArray)![
			format(date, 'yyyy-MM-dd')
		].find((x) => x.start_time === selectedSlot);

		if (!availableSlot) {
			console.warn('Slot not found');
			return;
		}

		try {
			await createAppointment.mutateAsync({
				orderId,
				data: {
					endTime: availableSlot.end_time,
					memberId: availableSlot.member_id,
					startDate: format(date, 'yyyy-MM-dd'),
					startTime: availableSlot.start_time,
				},
			});
			router.push(
				`${WEBSITE_URL}/payment-confirmation/?payment_status=success&orderId=${orderId}&no_appointments=false`
			);
		} catch {
			router.push(`/error?ref=${orderId}`);
		}
	}

	useEffect(() => {
		if (isError) {
			router.push(`/error?ref=${orderId}`);
		}
	}, [isError, orderId, router]);

	if (!orderId) {
		return null;
	}

	const slots = availableDates[format(date, 'yyyy-MM-dd')];

	const shouldShow = availableDates && Object.keys(availableDates).length > 0;

	return (
		<div className="flex flex-col md:flex-row gap-4 mx-auto md:mx-0 md:w-full">
			{!shouldShow ? (
				<div className="py-6 flex justify-center w-full">
					<img src="/home/elephant-2.svg" className="h-32 floating" alt="elephant" />
				</div>
			) : (
				<>
					<DatePicker
						selectedDate={date}
						loading={false}
						minDate={minDate}
						maxDate={maxDate}
						onDateSelect={(newDate) => {
							setDate(newDate);
						}}
						unavailableDates={unavailableDates}
					/>
					<div className="border border-gray-200 p-4 rounded-md bg-white shadow-md flex-1 flex flex-col">
						Available slots
						<div className="py-5">
							<div className="overflow-auto max-h-48 flex flex-col gap-1">
								{slots?.map((slot, i) => (
									<button
										type="button"
										key={i}
										onClick={() => setSelectedSlot(slot.start_time)}
										className={clsx('p-2 rounded-sm transition', {
											'bg-primary text-white':
												selectedSlot === slot.start_time,
											'bg-gray-100 hover:bg-gray-200':
												selectedSlot !== slot.start_time,
										})}
									>
										{slot.start_time} - {slot.end_time}
									</button>
								))}
							</div>
						</div>
						<Button
							onClick={handleSelect}
							variant="primary"
							disabled={!selectedSlot}
							loading={createAppointment.isPending}
						>
							Select
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
