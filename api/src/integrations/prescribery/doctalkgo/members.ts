import { addHours } from 'date-fns';
import { prescriberyFetch } from './api';

export type Members = {
	code: number;
	message: string;
	members: {
		member_id: number;
		home_phone: string;
		country: string;
		gender: string;
		city: string;
		prefix: string;
		degree: string;
		mobile: string;
		last_name: string;
		zip_code: string;
		zuid: string;
		is_member_photo_available: string;
		full_name: string;
		address_line2: string;
		address_line1: string;
		specialization: string;
		created_date: string;
		state: string;
		first_name: string;
		email: string;
		introduction: string;
		npi: string;
		dtg: string;
		avatar: string;
		s3_upload: number;
		practice_experience: string;
		user_details: {
			id: number;
			user_id: number;
			date_of_birth: string;
			birth_place: string | null;
			gender: string;
			practice_experience: string | null;
			appointment_delay_minutes: number;
			specialist: string;
			sub_specialist: string | null;
			board_certified: string | null;
			certifying_board: string | null;
			social_security_number: string | null;
			taxonomy: string | null;
			caqh_number: string | null;
			medicare_patn: string | null;
			medicaid_number: string | null;
			malpractice_history: string | null;
			active_board_certifications: string | null;
			clinical_experience: string | null;
			created_at: string;
			updated_at: string;
			is_profile_complete: number;
			platform: string | null;
			license_type: string;
			tenant_id: string;
			description: string | null;
			other: string | null;
		};
		state_code: string;
	}[];
	page_context: {
		page: number;
		per_page: string;
		has_more_page: string;
		sort_column: string;
		sort_order: string;
	};
};

let CACHED_MEMBERS:
	| {
			expires_at: number;
			members: Members['members'];
	  }
	| undefined = undefined;

/**
TODO: replace all prescribery calls with "prescriberyFetch"
For some reason this method didn't work AT ALL with axios.
 */
export async function getMembers(sourceId: string) {
	const cached = CACHED_MEMBERS;
	if (cached && cached.expires_at && cached.expires_at > Date.now() + 10000) {
		return cached.members;
	}
	const url = `/members?source_id=${sourceId}`;

	const data = await prescriberyFetch<Members>(url);

	CACHED_MEMBERS = {
		members: data.members,
		expires_at: addHours(new Date(), 1).getTime(),
	};

	return data.members;
}

/**
 
GET https://staging.doctalkgo.com/api/dtg/v1/members?license_state=Texas&source_id=66
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiODE1NzE4MzUzZjMyY2Y4MjBmZGU5ODRjNWUxNjA2MTgwOGYxYmVlMzllMGVkYmJkZmEzNGMwMTU2ODczYjNkNmViMDU4ZTljMDVhY2JiYmMiLCJpYXQiOjE3Mjk2MDM0MjguODgwMjMyLCJuYmYiOjE3Mjk2MDM0MjguODgwMjM3LCJleHAiOjE3Mjk2MDcwMjguODY1OTA0LCJzdWIiOiI4MzUiLCJzY29wZXMiOlsiKiJdfQ.C1TxrinZhffPEO4zl8yn_07yZqw31fo5nWnosuQ0E8kJ6sQZs4NxvBztGHob19fSrJUNlK7wC3iRWC8wLSdGTq66biWCUbhdIn3Zf1bm5Xu9pNboN-ipQRU3jtLmCPfNgK-oInxcvimGfmsy8rHo3vPYWwnJocvrVIKXRKqLmyxl5RUjLRXjf4stPJ27X4PUYXXIBzrWmaXPaVFqlxdVsHFp0aJg88eqcR8xcPyVcJl-EjAiGG9D-5tqXrJleTbE3_QZB4jgM7weqwXDqOhCtPL8Ky-IJ6SPsLhTp8vkFfegprcNAY2vHIFSG2etwY8QqsX5lIXcjpGjAbuddEvK0f3KP95wGiCVXNYT9Ih9l5972_g0UGcuY7Wozg9afMyh9CMyKw32hQDkW5FDuGn5V2sB0mLKhc1_-kNqnj9gDDMywz6gqpArCRGWBVxRtFvAdDyJpS2VYdC6UXZLEuWV2ruTmmUnHXa9Hkma2N_G8xXxhpvemEjsMC7IVcq2yOjq04bRoT2ITns0Wl_pRUI9Czm3QCRlEIMatgv4wxt4bg-WhuNBSzM90O1eCQx-DS64E0JMbM44Zi7jmj9jRsRIimYM3HvumLuch-TOXkr4n5IpT2p3Ig5U1QlIljbOcFFZUSt9ef2xMM4yuprRVrbc5RbeZTIFGrsX8ehjdebf0yU

 */
