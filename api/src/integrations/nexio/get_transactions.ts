import { api } from '.';

export type Transaction = {
	id: number;
	merchantId: string;
	transactionDate: string; // ISO date string
	amount: number;
	authCode: string;
	transactionStatus: number;
	transactionType: number;
	cardType: number;
	cardNumber: string;
	cardHolder: string;
	processMethod: number;
	achDetailId: number | null;
	currencyId: string;
	reportDate: string; // ISO date string
	settledDate: string; // ISO date string
	capturedDate: string; // ISO date string
	originalTransactionId: number | null;
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
};

export async function getTransactions({
	limit = 10,
	offset = 0,
	transactionStatus,
}: {
	limit?: number;
	offset?: number;
	transactionStatus?: number[];
}) {
	const { data } = await api.get<{
		offset: number;
		limit: number;
		rows: Transaction[];
		hasMore: boolean;
	}>(
		`/transaction/v3?offset=${offset}&limit=${limit}${transactionStatus ? `&transactionStatus=${transactionStatus.join(',')}` : ''}`,
	);
	return data;
}

// 30,32,39,40,50
