import { getStateRules } from '../../../../integrations/prescribery/doctalkgo/state_rules';
import { Order } from '../../../types';
import { getProductPrescriberySource } from '../../../../resources/products';
import { US_STATES } from '../../../../resources/us_states';

export async function getStateRulesFromOrder(order: Order) {
	const state =
		US_STATES.find(
			(u) =>
				u.value.toLocaleLowerCase().trim() ===
				order.personalInfo.billing.stateCode.toLocaleLowerCase().trim(),
		)?.label || order.personalInfo.billing.stateCode.toLocaleLowerCase().trim();

	try {
		const sourceId = getProductPrescriberySource(order.products[0].product.id)!;
		const stateRule = await getStateRules(sourceId, state);
		return stateRule;
	} catch {
		return undefined;
	}
}
