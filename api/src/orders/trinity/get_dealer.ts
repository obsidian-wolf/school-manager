import { getDealerExtendedByDealerId } from '../../integrations/trinity/get_dealer_extended';
import { parseError } from '../../utils/axios';
import { logger } from '../../utils/logger';
import { TrinityCommission } from './types';

export async function getDealer(dealerId: number): Promise<TrinityCommission['dealer']> {
	if (!dealerId) {
		logger.error('No dealerId provided');
		return undefined;
	}
	const dealer: TrinityCommission['dealer'] = {
		date: new Date(),
	};

	try {
		const dealerSuccess = await getDealerExtendedByDealerId(dealerId);

		dealer!.success = dealerSuccess;
	} catch (axiosErr) {
		const error = parseError(axiosErr);

		dealer!.error = error;
	}

	return dealer;
}
