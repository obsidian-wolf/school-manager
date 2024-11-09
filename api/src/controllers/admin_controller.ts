import { Route, Tags, Get, Query, Post } from 'tsoa';

import { Unauthorized } from '../infrastructure/common/errors';
import { createAdHocOrderInstallment } from '../orders/ad_hoc/create_order_installment';
import { ProductId } from '../resources/products';
import { generateReceipt } from '../integrations/invoice_generator';
import {
	getProduct,
	ReassessmentFromMedication,
	ReassessmentToMedication,
	upgradeOrder,
} from '../orders/default/tier_upgrade';
import { recreateReassessment } from '../orders/default/reassessment/prescribery/recreate_reassessment';
import { PrescriberyMedication } from '../orders/default/reassessment/prescribery';

const KEY = 'QPE8uvz_uyj7mwfjyc';

@Route('admin')
@Tags('Admin')
export class AdminController {
	@Post('/create-ad-hoc-order-installment')
	public async createAdHocOrderInstallment(
		@Query() email: string,
		@Query() amount: number,
		@Query() productId: ProductId,
		@Query() key: string,
	) {
		if (key !== KEY) {
			throw new Unauthorized('Invalid key');
		}
		return await createAdHocOrderInstallment({ email, productId, amount });
	}

	@Get('/generate-receipt')
	public async generateReceipt(
		@Query() email: string,
		@Query() amount: number,
		@Query() productId: ProductId,
		@Query() key: string,
		@Query() date: string,
	) {
		if (key !== KEY) {
			throw new Unauthorized('Invalid key');
		}
		return await generateReceipt({
			email,
			amount,
			productId,
			date,
		});
	}

	@Get('/upgrade-reassessment')
	public async upgradeOrder(
		@Query() key: string,
		@Query() email: string,
		@Query() medicationFrom: ReassessmentFromMedication,
		@Query() medicationTo: ReassessmentToMedication,
	) {
		if (key !== KEY) {
			throw new Unauthorized('Invalid key');
		}
		const productFrom = getProduct(medicationFrom);
		const productTo = getProduct(medicationTo);
		return await upgradeOrder(email, productFrom, productTo);
	}

	@Get('/recreate-reassessment')
	public async recreateReassessment(
		@Query() key: string,
		@Query() email: string,
		@Query() medication: PrescriberyMedication,
	) {
		if (key !== KEY) {
			throw new Unauthorized('Invalid key');
		}
		return await recreateReassessment({
			email,
			medication,
		});
	}
}
