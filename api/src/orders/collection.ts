import { ObjectId, UpdateFilter, WithId } from 'mongodb';
import db from '../infrastructure/db';
import { BadRequest } from '../infrastructure/common/errors';
import { Order } from './types';
import { OrderAction } from './actions';

export const orderCollection = db.collection<Order>('order');

export async function getOrder(orderId: string): Promise<WithId<Order>> {
	// Check if the provided orderId is a valid ObjectId
	if (!ObjectId.isValid(orderId)) {
		throw new BadRequest('Invalid order id');
	}

	const order = await orderCollection.findOne({
		_id: new ObjectId(orderId),
	});

	if (!order) {
		throw new BadRequest('Order not found');
	}

	return order;
}

export async function updateOrder(
	orderId: string,
	partial: Partial<Order>,
	action: OrderAction,
): Promise<void> {
	// Check if the provided orderId is a valid ObjectId
	if (!ObjectId.isValid(orderId)) {
		throw new BadRequest('Invalid order id');
	}

	const fieldsToSet: Partial<Order> = {};
	const fieldsToUnset: Partial<Record<keyof Order, true>> = {};

	for (const key of Object.keys(partial) as (keyof Order)[]) {
		const value = partial[key];
		if (value === undefined) {
			fieldsToUnset[key] = true;
		} else {
			fieldsToSet[key] = value as any;
		}
	}

	const updateObject: UpdateFilter<Order> = {};

	if (Object.keys(fieldsToSet).length > 0) {
		updateObject.$set = fieldsToSet;
	}

	if (Object.keys(fieldsToUnset).length > 0) {
		updateObject.$unset = fieldsToUnset;
	}

	// Handle action
	if (action) {
		if ('logs' in fieldsToSet) {
			// if logs set in $set, append action to logs array
			const logs = fieldsToSet.logs as any[];
			if (Array.isArray(logs)) {
				logs.push({
					date: new Date(),
					...action,
				});
			} else {
				// init logs array with action
				fieldsToSet.logs = [
					{
						date: new Date(),
						...action,
					},
				];
			}
		} else {
			// if not logs set, use $push
			updateObject.$push = {
				logs: {
					date: new Date(),
					...action,
				},
			};
		}
	}

	const result = await orderCollection.updateOne({ _id: new ObjectId(orderId) }, updateObject);

	if (result.matchedCount === 0) {
		throw new BadRequest('Order not found');
	}
}
