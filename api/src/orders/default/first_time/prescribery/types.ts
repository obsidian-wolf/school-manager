import { Patient } from '../../../../integrations/prescribery/doctalkgo/get_patient';

export type Appointment = {
	memberId: number;
	appointmentId: number;
} & (
	| {
			type: 'sync';
			startDate: string;
			startTime: string;
			endTime: string;
	  }
	| {
			type: 'async';
	  }
);

export type PrescriberyFirstTime = {
	appointment?: Appointment;
	// TODO: what to do here regarding support?
	noAppointmentAvailable?: boolean;
	isSync?: boolean;
	patient?: Patient;
	entry: string;
	questionnaireIds?: number[];
};
