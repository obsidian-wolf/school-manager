import { api } from '.';

export type SourceUser = {
	id: string;
	item_key: string;
	name: string;
	ip: string;
	meta: {
		bcido: string;
		bmd0t: string;
		first_name: string;
		middle_name: string;
		last_name: string;
		'29yf4d': string;
		gender: string;
		dob: string;
		'dob-value': string;
		phone: string;
		brand_id: string;
		y7ju7: string;
		sponsor_id: string;
		cfylh: string;
		dva0p: string;
		otbq6: string;
		xiruv: string;
		state_name: string;
		'state_name-value': string;
		'7dxqa': string;
		qrhl6: string;
		'qrhl6-value': string;
		'42z2c': string[];
		l2ipc: string;
	};
	form_id: string;
	post_id: string;
	user_id: string;
	parent_item_id: string;
	is_draft: string;
	updated_by: string;
	created_at: string;
	updated_at: string;
};

export type ParsedFormidableUser = {
	id: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string; // 29yf4d
	gender: string; // Male or Female
	dob: Date; // 04/06/1988
	dealer_id: string;
	phone: string;
	brand_id: string;
	sponsor_id: string;
	address: string; // cfylh
	address2: string; // cfylh
	city: string; // otbq6
	postcode: string; // xiruv
	state: string; // state_name
	stateCode: string; // state_name-value
};

export async function getFormidableUser(email: string) {
	let userData: Record<string, SourceUser> = {};
	try {
		const { data } = await api.get<Record<string, SourceUser>>(
			`/wp-json/frm/v2/forms/1/entries?search=${email}`,
		);
		userData = data;
	} catch {
		return undefined;
	}
	const user = Object.values(userData).find((u) => u.meta?.['29yf4d'] === email);

	if (!user) {
		return undefined;
	}

	const formidableUser: ParsedFormidableUser = {
		id: user.id,
		first_name: user.meta.first_name,
		middle_name: user.meta.middle_name,
		last_name: user.meta.last_name,
		email: user.meta['29yf4d'],
		gender: user.meta.gender,
		dob: new Date(user.meta['dob-value']),
		phone: user.meta.phone,
		brand_id: user.meta.brand_id,
		sponsor_id: user.meta.sponsor_id,
		dealer_id: user.meta['y7ju7'],
		address: user.meta.cfylh,
		address2: user.meta.dva0p,
		city: user.meta.otbq6,
		postcode: user.meta.xiruv,
		state: user.meta.state_name,
		stateCode: user.meta['state_name-value'],
	};

	return formidableUser;
}
