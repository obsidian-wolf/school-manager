import { Route, Tags, Path, Get, Query, Post } from 'tsoa';

import { getAdHocOrderInstallment } from '../orders/ad_hoc/get_order_installment';
import { getNexioAdHocPaymentUrl } from '../orders/ad_hoc/get_payment_url';
import { processAdHocNexioPayment } from '../orders/ad_hoc/process_nexio_payment';

@Route('ad_hoc')
@Tags('AdHoc')
export class AdHocController {
	@Get('/{orderId}/details')
	public async getAdHocOrderInstallment(@Path() orderId: string, @Query() installmentId: string) {
		return await getAdHocOrderInstallment(orderId, installmentId);
	}

	@Post('/{orderId}/process')
	public async processAdHocNexioPayment(
		@Path() orderId: string,
		@Query() installmentId: string,
		@Query() nexioPaymentId: string,
	) {
		return await processAdHocNexioPayment({
			orderId,
			installmentId,
			nexioPaymentId,
		});
	}

	@Get('/{orderId}/nexio-url')
	public async getNexioAdHocPaymentUrl(
		@Path() orderId: string,
		@Query() installmentId: string,
		@Query() reset: boolean = false,
	) {
		return await getNexioAdHocPaymentUrl(orderId, installmentId, { reset });
	}
}
