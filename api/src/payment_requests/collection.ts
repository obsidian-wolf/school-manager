import db from '../infrastructure/db';
import { PaymentRequest } from './types';

export const paymentRequestCollection = db.collection<PaymentRequest>('payment_request');
