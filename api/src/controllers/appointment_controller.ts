import { Route, Tags, Path, Get, Post, Body } from 'tsoa';
import { getAppointments } from '../orders/default/first_time/prescribery/get_appointments';
import {
	createSyncAppointment,
	CreateSyncAppointmentRequest,
} from '../orders/default/first_time/prescribery/create_appointment';

@Route('appointment')
@Tags('Appointment')
export class AppointmentController {
	@Get('/{orderId}')
	public async getAppointments(@Path() orderId: string) {
		return await getAppointments(orderId);
	}

	@Post('/{orderId}')
	public async createSyncAppointment(
		@Path() orderId: string,
		@Body() request: CreateSyncAppointmentRequest,
	) {
		return await createSyncAppointment({
			...request,
			orderId,
		});
	}
}
