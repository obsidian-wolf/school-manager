import { PrescriberyPaymentRequest } from '.';
import { getPersonalInfoFromWp } from '../../../../integrations/wordpress';
import { AddressSchema } from '../../../../resources/address';
import { PersonalInfo } from '../../../../resources/personal_info';
import { US_STATES } from '../../../../resources/us_states';
import { deepCopy } from '../../../../utils/deep_copy';

export async function getPersonalInfo(request: PrescriberyPaymentRequest): Promise<PersonalInfo> {
	const personalInfo = await getPersonalInfoFromWp(request.email);

	if (!request.shipping || !request.billing) {
		return personalInfo;
	}

	const shippingState = US_STATES.find(
		(u) => u.label === request.shipping!.state || u.value === request.shipping!.state,
	)?.value;
	const billingState = US_STATES.find(
		(u) => u.label === request.billing!.state || u.value === request.billing!.state,
	)?.value;

	const shipping = deepCopy(personalInfo.shipping);
	const billing = deepCopy(personalInfo.billing);

	shipping.address = request.shipping.address_line1!;
	shipping.city = request.shipping.city!;
	shipping.postcode = request.shipping.postal_code!;
	shipping.stateCode = shippingState as any;

	billing.address = request.billing.address_line1!;
	billing.city = request.billing.city!;
	billing.postcode = request.billing.postal_code!;
	billing.stateCode = billingState as any;

	if (AddressSchema.safeParse(billing).success && AddressSchema.safeParse(shipping).success) {
		return {
			user: personalInfo.user,
			shipping,
			billing,
		};
	}
	return personalInfo;
}
