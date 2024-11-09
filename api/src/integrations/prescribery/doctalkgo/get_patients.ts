import { prescriberyFetch } from './api';
import { wait } from '../../../utils/wait';

export type SearchPatient = {
	gender: 'male' | 'female';
	first_name: string;
	email: string;
	created_time: string; // Ideally, use Date if this is a Date object
	mobile: string;
	last_name: string;
	active: 'active' | 'inactive';
	record_id: string;
	full_name: string;
	patient_id: number;
	dob: string; // Ideally, use Date if this is a Date object
	zip_code: string;
	state: string;
	city: string;
	height: string;
	weight: number;
	created_date: string; // Ideally, use Date if this is a Date object
};

export async function getAllPatients() {
	const PER_PAGE = 100;
	let page = 1;
	let allPatients: SearchPatient[] = [];
	while (true) {
		const data = await getPatients({
			page,
			perPage: PER_PAGE,
		});
		allPatients = allPatients.concat(data.patients);
		if (data.page_context.has_more_page !== 'true') {
			break;
		} else {
			page++;
		}
		await wait(1000);
	}
}

export async function getPatients({
	page = 1,
	perPage = 10,
	recordId,
}: {
	page?: number;
	perPage?: number;
	recordId?: string;
}) {
	const data = await prescriberyFetch<{
		patients: SearchPatient[];
		page_context: {
			page: number;
			per_page: number;
			has_more_page: string;
		};
	}>(`/patients?per_page=${perPage}&page=${page}${recordId ? `&record_id=${recordId}` : ''}`, {
		method: 'GET',
	});
	return data;
}

/**
 *  {
    "record_id": "PAT826936205",
    "first_name": "Laura",
    "last_name": "Waghorn",
    "location": "   ,  ",
    "age": null,
    "timezone_abbr": "PST",
    "uid": null,
    "full_name": "Laura Waghorn"
  }
 */
type SearchPatientsAccessibleResponse = {
	record_id: string;
	first_name: string;
	last_name: string;
	location: string;
	age: number;
	timezone_abbr: string;
	uid: string;
	full_name: string;
};

export async function freeSearchPatients(query: string) {
	return await prescriberyFetch<SearchPatientsAccessibleResponse[]>(
		`/searchPatientsAccessible?search_input=${query}`,
		{
			method: 'GET',
		},
	);
}
