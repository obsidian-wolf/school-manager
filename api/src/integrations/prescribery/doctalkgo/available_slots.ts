import { addMonths, format } from 'date-fns';
import { callApi } from './api';

export type AvailableSlot = {
	start_time: string;
	end_time: string;
	member_id: number;
};

export type AvailableSlots = Record<string, AvailableSlot[]>;

type AvailableSlotsResponse = {
	code: number;
	available_slots?: AvailableSlots;
};

export async function getAvailableSlots(sourceId: string, state: string) {
	const response = await callApi<AvailableSlotsResponse>({
		url: '/members/availableslots',
		params: {
			source_id: sourceId,
			license_state: state,
			from_date: format(new Date(), 'yyyy-MM-dd'),
			to_date: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
		},
	});

	return response.available_slots;
}

/**
 *  "2024-09-26": [
      {
        "start_time": "05:00 AM",
        "end_time": "05:10 AM",
        "member_id": 563
      },
 */

/**
	   * /holdAppointmentSlot
	   *  "member_id": 563
	   * start_time: 05:00 AM
	   * start_date: 2024-09-26
	   * duration_in_minutes: 10
	   * {
  "status": "success",
  "message": "Hold appointment slot.",
  "holdSlot": 674
}


Mode: Video Call | Phone Call
repetition: Single Date
patient: 3958

{
  "code": 0,
  "message": "Appointment scheduled successfully.",
  "appointment": {
    "appointment_id": 9738
  }
}

https://staging.doctalkgo.com/api/dtg/v1/members/availableslots?from_date=2024-09-26&license_state=California&to_date=2024-10-26
  
	   */
