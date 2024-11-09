import { Request, Route, Tags, Path, Get, Query, Post, Body, Hidden } from 'tsoa';
import express from 'express';
import {
	BillingAndShippingInfoRequest,
	submitBillingAndShipping,
} from '../orders/default/submit_billing_and_shipping';
import { getOrderDetails } from '../orders/default/order_details';
import { getNexioPayInFullPaymentUrl } from '../orders/default/nexio/get_pay_in_full_payment_url';
import { processNexioPayment } from '../orders/default/nexio/process_nexio_payment';
import { getNexioPayOverTimePaymentUrl } from '../orders/default/nexio/get_pay_over_time_payment_url';
import { processAfterpayPayment } from '../orders/default/afterpay/process_afterpay_payment';
import { getAfterpayCheckoutResponse } from '../orders/default/afterpay/get_checkout_response';
import { getWebUrl } from '../helpers/get_web_url';
import { logger } from '../utils/logger';
import { createOrderFromPaymentRequest } from '../payment_requests/create_order_from_payment_request';

@Route('pay')
@Tags('Pay')
export class PayController {
	@Get('/')
	@Hidden()
	public async createOrderAndRedirect(@Query() id: string, @Request() req: express.Request) {
		const orderId = await createOrderFromPaymentRequest(id);

		req.res!.redirect(
			getWebUrl({
				path: '/',
				orderId,
			}),
		);
	}

	/**
	 * Details
	 */
	@Post('/billing-and-shipping/{orderId}')
	public async submitBillingAndShipping(
		@Path() orderId: string,
		@Body() request: BillingAndShippingInfoRequest,
	) {
		return await submitBillingAndShipping(orderId, request);
	}
	@Get('/details/{orderId}')
	public async getOrderDetails(@Path() orderId: string) {
		return await getOrderDetails(orderId);
	}

	/**
	 * Nexio pay in full
	 */
	@Get('/nexio-pay-in-full/{orderId}/url')
	public async getNexioPayInFullPaymentUrl(
		@Path() orderId: string,
		@Query() reset: boolean = false,
	) {
		return await getNexioPayInFullPaymentUrl(orderId, { reset });
	}
	@Post('/nexio-pay-in-full/{orderId}/process')
	public async processNexioPayInFullPayment(
		@Path() orderId: string,
		@Query() nexioPaymentId: string,
	) {
		return await processNexioPayment({
			orderId,
			nexioPaymentId,
			payInFull: true,
		});
	}

	/**
	 * Nexio pay over time
	 */
	@Get('/nexio-pay-over-time/{orderId}/url')
	public async getNexioPayOverTimePaymentUrl(
		@Path() orderId: string,
		@Query() reset: boolean = false,
	) {
		return await getNexioPayOverTimePaymentUrl(orderId, { reset });
	}
	@Post('/nexio-pay-over-time/{orderId}/process')
	public async processNexioPayOverTimePayment(
		@Path() orderId: string,
		@Query() nexioPaymentId: string,
	) {
		return await processNexioPayment({
			orderId,
			nexioPaymentId,
			payInFull: false,
		});
	}

	/**
	 * Afterpay
	 */
	@Get('/afterpay/confirm')
	public async processAfterpayPaymentConfirm(
		@Request() req: express.Request,
		@Query() orderToken: string,
		@Query() orderId: string,
		@Query() status?: string,
	) {
		try {
			const result = await processAfterpayPayment(orderId, status === 'SUCCESS', orderToken);

			req.res!.redirect(result);
		} catch (e) {
			logger.warn('Error processing afterpay payment', e);
			return getWebUrl({
				path: '/error',
				orderId,
				type: 'afterpay',
				redirectUrl: '/?orderId=' + orderId,
			});
		}
	}
	@Get('/afterpay/cancel')
	public async processAfterpayPaymentCancel(
		@Request() req: express.Request,
		@Query() orderToken: string,
		@Query() orderId: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Query() status?: string,
	) {
		try {
			const result = await processAfterpayPayment(orderId, false, orderToken);

			req.res!.redirect(result);
		} catch (e) {
			logger.warn('Error processing afterpay payment', e);
			return getWebUrl({
				path: '/error',
				orderId,
				type: 'afterpay',
				redirectUrl: '/?orderId=' + orderId,
			});
		}
	}
	@Get('/afterpay/checkout/{orderId}')
	public async getAfterpayCheckoutUrl(@Request() req: express.Request, @Path() orderId: string) {
		return (await getAfterpayCheckoutResponse(orderId))?.redirectCheckoutUrl;
	}
}
