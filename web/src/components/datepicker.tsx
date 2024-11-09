import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
type DatepickerProps = {
	selectedDate: Date;
	minDate?: Date;
	maxDate?: Date;
	unavailableDates: Date[];
	loading: boolean;
	onDateSelect: (date: Date) => void;
};

const Datepicker: React.FC<DatepickerProps> = ({
	selectedDate,
	minDate,
	maxDate,
	unavailableDates,
	loading,
	onDateSelect,
}) => {
	const [currentDate, setCurrentDate] = useState<Date>(selectedDate);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	const firstDayOfMonth = new Date(year, month, 1);

	// Helper functions...

	const getWeekday = (date: Date): number => {
		// Returns 0 (Monday) to 6 (Sunday)
		return (date.getDay() + 6) % 7;
	};

	const isSameDay = (date1: Date, date2: Date): boolean => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const isDateSelectable = (date: Date): boolean => {
		if (loading) return false;
		if (minDate && date < minDate) return false;
		if (maxDate && date > maxDate) return false;
		if (unavailableDates.some((d) => isSameDay(d, date))) return false;
		return true;
	};

	// Calculate whether to disable previous and next buttons

	const canGoToPreviousMonth = (): boolean => {
		if (loading) return false;
		if (!minDate) return true;
		const previousMonth = new Date(year, month - 1, 1);
		return previousMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
	};

	const canGoToNextMonth = (): boolean => {
		if (loading) return false;
		if (!maxDate) return true;
		const nextMonth = new Date(year, month + 1, 1);
		const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
		return nextMonth <= maxMonth;
	};

	const handlePreviousMonth = () => {
		if (!canGoToPreviousMonth()) return;
		setCurrentDate(new Date(year, month - 1, 1));
	};

	const handleNextMonth = () => {
		if (!canGoToNextMonth()) return;
		setCurrentDate(new Date(year, month + 1, 1));
	};

	// Generate dates...

	const firstDayWeekday = getWeekday(firstDayOfMonth);
	const startDate = new Date(firstDayOfMonth);
	startDate.setDate(firstDayOfMonth.getDate() - firstDayWeekday);

	const dates: Date[] = [];
	for (let i = 0; i < 42; i++) {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);
		dates.push(date);
	}

	const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	return (
		<div className="w-72 border border-gray-200 p-4 rounded-md bg-white shadow-md">
			{loading && <div className="text-center mb-2 text-gray-600">Loading...</div>}

			<div className="flex justify-between items-center mb-2">
				<button
					onClick={handlePreviousMonth}
					disabled={!canGoToPreviousMonth()}
					className={clsx('text-gray-600 hover:text-gray-800 disabled:text-gray-400', {
						'cursor-not-allowed': !canGoToPreviousMonth(),
					})}
				>
					<ChevronLeftIcon className="h-5 w-5" />
				</button>
				<span className="font-semibold text-gray-800">
					{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
				</span>
				<button
					onClick={handleNextMonth}
					disabled={!canGoToNextMonth()}
					className={clsx('text-gray-600 hover:text-gray-800 disabled:text-gray-400', {
						'cursor-not-allowed': !canGoToNextMonth(),
					})}
				>
					<ChevronRightIcon className="h-5 w-5" />
				</button>
			</div>

			<div className="grid grid-cols-7 text-center mb-2">
				{weekdayNames.map((weekday) => (
					<div key={weekday} className="font-semibold text-gray-700 text-sm">
						{weekday}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 text-center">
				{dates.map((date, index) => {
					const isCurrentMonth = date.getMonth() === month;
					const isSelected = isSameDay(date, selectedDate);
					const isToday = isSameDay(date, new Date());
					const selectable = isDateSelectable(date);

					return (
						<div key={index} className="p-1">
							<button
								onClick={() => {
									onDateSelect(date);
									// if date is not same month as current month, change current month
									if (date.getMonth() !== month) {
										setCurrentDate(date);
									}
								}}
								disabled={!selectable}
								className={clsx(
									'w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium',
									{
										'text-gray-200': !isCurrentMonth && !isToday,
										'text-white bg-gray-800': isSelected,
										'text-gray-900':
											isCurrentMonth && !isSelected && !isToday && selectable,
										'text-gray-300': !selectable && !isToday,
										'cursor-not-allowed': !selectable,
										'border border-gray-800': isToday && !isSelected,
										'hover:bg-gray-200': selectable && !isSelected && !isToday,
										'bg-gray-800 text-white': isSelected,
										'bg-gray-100': isToday && !isSelected,
									}
								)}
							>
								{date.getDate()}
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Datepicker;
