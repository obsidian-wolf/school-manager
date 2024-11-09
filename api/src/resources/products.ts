import config from '../config';
import { TrinityProduct } from '../orders/trinity/types';

const isProd = config.PRESCRIBERY_API_URL === 'https://staff.doctalkgo.com/api/dtg/v1';

const PRODUCTS: Product[] = [
	{
		id: 'semaglutide_tier_1',
		name: 'Semaglutide',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Semaglutide.jpg',
		tier: 1,
		trinityId: 'Product 1',
		retailPrice: 299,
		wholesalePrice: 299,
		psvAmount: 220,
		uplineVolume: 154,
		payOverTimePlan: [299, 299, 299],
		monthSupply: 3,
		sku: 'mtu0',
		type: 'medication',
		prescriberyTemplate: isProd ? '1416' : '650',
		prescriberySource: isProd ? '446' : '260',
	},
	{
		id: 'semaglutide_tier_2',
		name: 'Semaglutide',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Semaglutide.jpg',
		tier: 2,
		trinityId: 'Product 2',
		retailPrice: 349,
		wholesalePrice: 349,
		psvAmount: 220,
		uplineVolume: 154,
		payOverTimePlan: [349, 349, 349],
		monthSupply: 3,
		type: 'medication',
		prescriberyTemplate: isProd ? '1416' : '650',
		prescriberySource: isProd ? '446' : '260',
	},
	{
		id: 'semaglutide_tier_3',
		name: 'Semaglutide',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Semaglutide.jpg',
		tier: 3,
		trinityId: 'Product 3',
		retailPrice: 399,
		wholesalePrice: 399,
		psvAmount: 220,
		uplineVolume: 154,
		payOverTimePlan: [399, 399, 399],
		monthSupply: 3,
		type: 'medication',
		prescriberyTemplate: isProd ? '1416' : '650',
		prescriberySource: isProd ? '446' : '260',
	},
	{
		id: 'tirzepatide_tier_1',
		name: 'Tirzepatide',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Tirzepatide.jpg',
		tier: 1,
		trinityId: 'Product 4',
		retailPrice: 449,
		wholesalePrice: 449,
		psvAmount: 240,
		uplineVolume: 168,
		payOverTimePlan: [449, 449, 449],
		monthSupply: 3,
		sku: 'mtu1',
		type: 'medication',
		prescriberyTemplate: isProd ? '1416' : '650',
		prescriberySource: isProd ? '446' : '260',
	},
	{
		id: 'tirzepatide_tier_2',
		name: 'Tirzepatide',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Tirzepatide.jpg',
		tier: 2,
		trinityId: 'Product 5',
		retailPrice: 599,
		wholesalePrice: 599,
		psvAmount: 240,
		uplineVolume: 168,
		payOverTimePlan: [599, 599, 599],
		monthSupply: 3,
		type: 'medication',
		prescriberyTemplate: isProd ? '1416' : '650',
		prescriberySource: isProd ? '446' : '260',
	},
	{
		id: 'tirzepatide_tier_3',
		name: 'Tirzepatide',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Tirzepatide.jpg',
		tier: 3,
		trinityId: 'Product 6',
		retailPrice: 799,
		wholesalePrice: 799,
		psvAmount: 240,
		uplineVolume: 168,
		payOverTimePlan: [799, 799, 799],
		monthSupply: 3,
		type: 'medication',
		prescriberyTemplate: isProd ? '1416' : '650',
		prescriberySource: isProd ? '446' : '260',
	},

	{
		id: 'b12',
		name: 'B12',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/B12.jpg',
		trinityId: 'Product 7',
		retailPrice: 99,
		wholesalePrice: 99,
		psvAmount: 33,
		uplineVolume: 23,
		monthSupply: 3,
		sku: 'mty1',
		type: 'medication',
		prescriberyTemplate: isProd ? '1540' : '668',
		prescriberySource: isProd ? '462' : '271',
	},
	{
		id: 'nad_injection',
		name: 'NAD Injection',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/NAD.jpg',
		trinityId: 'Product 9',
		retailPrice: 219,
		wholesalePrice: 219,
		psvAmount: 63,
		uplineVolume: 44,
		monthSupply: 2,
		sku: 'mty2',
		type: 'medication',
		prescriberySource: isProd ? '466' : '270',
		prescriberyTemplate: isProd ? '1806' : '669',
	},
	{
		id: 'nad_nasal_spray',
		name: 'NAD Nasal Spray',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/elliemd_Longevity_NAD_NasalSpray_Shot2_0004.png',
		trinityId: 'Product 10',
		retailPrice: 185,
		wholesalePrice: 185,
		psvAmount: 100,
		uplineVolume: 70,
		monthSupply: 2,
		sku: 'mty3',
		type: 'medication',
		prescriberySource: isProd ? '467' : '276',
		prescriberyTemplate: isProd ? '1802' : '674',
	},
	{
		id: 'sermorelin',
		name: 'Sermorelin',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Sermorelin.jpg',
		trinityId: 'Product 11',
		retailPrice: 215,
		wholesalePrice: 215,
		psvAmount: 100,
		uplineVolume: 70,
		monthSupply: 3,
		sku: 'mty4',
		type: 'medication',
		prescriberySource: isProd ? '463' : '272',
		prescriberyTemplate: isProd ? '1803' : '670',
	},
	{
		id: 'synapsin',
		name: 'Synapsin',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/elliemd_SexualHealth_Synapsin_Nasal_Shot2_0004.png',
		trinityId: 'Product 12',
		retailPrice: 145,
		wholesalePrice: 145,
		psvAmount: 75,
		uplineVolume: 53,
		monthSupply: 2,
		sku: 'mty5',
		type: 'medication',
		prescriberySource: isProd ? '465' : '274',
		prescriberyTemplate: isProd ? '1804' : '672',
	},
	{
		id: 'pt_141_injection',
		name: 'PT 141 Injection',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/PT-141.jpg',
		trinityId: 'Product 13',
		retailPrice: 219,
		wholesalePrice: 219,
		psvAmount: 113,
		uplineVolume: 79,
		monthSupply: 2,
		sku: 'mtcy',
		type: 'medication',
		prescriberySource: isProd ? '464' : '273',
		prescriberyTemplate: isProd ? '1805' : '671',
	},
	{
		id: 'pt_141_nasal_spray',
		name: 'PT 141 Nasal Spray',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/PT-141-05ml.jpg',
		trinityId: 'Product 14',
		retailPrice: 129,
		wholesalePrice: 129,
		psvAmount: 42,
		uplineVolume: 29,
		monthSupply: 3,
		sku: 'mtcz',
		type: 'medication',
		prescriberySource: isProd ? '466' : '275',
		prescriberyTemplate: isProd ? '1806' : '673',
	},
	{
		id: 'semaglutide_sublingual_tier_1',
		name: 'Semaglutide Sublingual Drops',
		url: 'https://elliemd.com/wp-content/uploads/2024/10/elliemd_WeightManagement_Semaglutide_Dropper_Shot1_1-1.jpg',
		tier: 1,
		trinityId: 'Product 15',
		retailPrice: 299,
		wholesalePrice: 299,
		psvAmount: 180,
		uplineVolume: 126,
		monthSupply: 3,
		payOverTimePlan: [299, 299, 299],
		sku: 'mja2',
		type: 'medication',
		prescriberySource: isProd ? '494' : '650',
		prescriberyTemplate: isProd ? '1831' : '260',
	},
	{
		id: 'semaglutide_sublingual_tier_2',
		name: 'Semaglutide Sublingual Drops',
		url: 'https://elliemd.com/wp-content/uploads/2024/10/elliemd_WeightManagement_Semaglutide_Dropper_Shot1_1-1.jpg',
		tier: 2,
		trinityId: 'Product 16',
		retailPrice: 379,
		wholesalePrice: 379,
		psvAmount: 180,
		uplineVolume: 126,
		payOverTimePlan: [379, 379, 379],
		monthSupply: 3,
		type: 'medication',
		prescriberySource: isProd ? '494' : '650',
		prescriberyTemplate: isProd ? '1831' : '260',
	},
	{
		id: 'semaglutide_sublingual_tier_3',
		name: 'Semaglutide Sublingual Drops',
		url: 'https://elliemd.com/wp-content/uploads/2024/10/elliemd_WeightManagement_Semaglutide_Dropper_Shot1_1-1.jpg',
		tier: 3,
		trinityId: 'Product 17',
		retailPrice: 399,
		wholesalePrice: 399,
		psvAmount: 180,
		payOverTimePlan: [399, 399, 399],
		uplineVolume: 126,
		monthSupply: 3,
		type: 'medication',
		prescriberySource: isProd ? '494' : '650',
		prescriberyTemplate: isProd ? '1831' : '260',
	},
	{
		id: 'sermorelin_tablets',
		name: 'Sermorelin Tablets',
		url: 'https://elliemd.com/wp-content/uploads/2024/10/elliemd_Sermorelin_PillBottle_Shot1_0001.png',
		trinityId: 'Product 22',
		retailPrice: 279,
		wholesalePrice: 279,
		psvAmount: 180,
		uplineVolume: 126,
		monthSupply: 3,
		sku: 'mja5',
		type: 'medication',
		prescriberySource: isProd ? '495' : '272',
		prescriberyTemplate: isProd ? '1835' : '670',
	},
	{
		id: 'nad_injection_1',
		name: 'NAD Injection',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/NAD.jpg',
		trinityId: 'Product 23',
		retailPrice: 175,
		wholesalePrice: 175,
		psvAmount: 62.5,
		uplineVolume: 44,
		monthSupply: 2,
		tier: 1,
		sku: 'mje0',
		type: 'medication',
		prescriberySource: isProd ? '461' : '270',
		prescriberyTemplate: isProd ? '1801' : '669',
	},
	{
		id: 'nad_injection_2',
		name: 'NAD Injection',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/NAD.jpg',
		trinityId: 'Product 24',
		retailPrice: 219,
		wholesalePrice: 219,
		psvAmount: 75,
		uplineVolume: 53,
		monthSupply: 2,
		tier: 2,
		sku: 'mje1',
		type: 'medication',
		prescriberySource: isProd ? '461' : '270',
		prescriberyTemplate: isProd ? '1801' : '669',
	},
	{
		id: 'semaglutide_microdose',
		name: 'Semaglutide Microdose',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Semaglutide.jpg',
		trinityId: 'Product 18',
		retailPrice: 229,
		wholesalePrice: 229,
		psvAmount: 175,
		uplineVolume: 123,
		monthSupply: 3,
		sku: 'mja3',
		type: 'medication',
		prescriberySource: isProd ? '496' : '270',
		prescriberyTemplate: isProd ? '1834' : '669',
	},
	{
		id: 'tirzepatide_microdose',
		name: 'Tirzepatide Microdose',
		url: 'https://elliemd.com/wp-content/uploads/2024/05/Tirzepatide.jpg',
		trinityId: 'Product 20',
		retailPrice: 299,
		wholesalePrice: 299,
		psvAmount: 195,
		uplineVolume: 137,
		monthSupply: 3,
		sku: 'mja4',
		type: 'medication',
		prescriberySource: isProd ? '496' : '270',
		prescriberyTemplate: isProd ? '1834' : '669',
	},
] as const;

export function getProductFromName(medicationName: string, tier?: number) {
	const m = PRODUCTS.find((m) => m.name === medicationName && m.tier === tier);
	return m && (JSON.parse(JSON.stringify(m)) as Product);
}

export function getProductPrescriberySource(id: ProductId) {
	const m = PRODUCTS.find((m) => m.id === id);
	return m?.prescriberySource;
}

export function getProductFromSku(sku: string) {
	const m = PRODUCTS.find((m) => m.sku?.toLocaleLowerCase() === sku.toLocaleLowerCase());
	return m && (JSON.parse(JSON.stringify(m)) as Product);
}

export function getProductFromId(id: ProductId) {
	const m = PRODUCTS.find((m) => m.id === id);
	return m && (JSON.parse(JSON.stringify(m)) as Product);
}

export type ProductId =
	| 'semaglutide_tier_1'
	| 'semaglutide_tier_2'
	| 'semaglutide_tier_3'
	| 'tirzepatide_tier_1'
	| 'tirzepatide_tier_2'
	| 'tirzepatide_tier_3'
	| 'b12'
	| 'nad_injection'
	| 'nad_injection_1'
	| 'nad_injection_2'
	| 'nad_nasal_spray'
	| 'sermorelin'
	| 'synapsin'
	| 'pt_141_injection'
	| 'pt_141_nasal_spray'
	| 'semaglutide_sublingual_tier_1'
	| 'semaglutide_sublingual_tier_2'
	| 'semaglutide_sublingual_tier_3'
	| 'sermorelin_tablets'
	| 'semaglutide_microdose'
	| 'tirzepatide_microdose';

export type ProductPricing = {
	/**
	 * Price per month supply.
	 */
	retailPrice: number;
	wholesalePrice: number;
	psvAmount: number;
	uplineVolume: number;
};

export type Product = ProductPricing & {
	id: ProductId;
	name: string;
	type: 'medication';
	tier?: number;
	/**
	 * Image URL.
	 */
	url: string;
	/**
	 * Optional. If not present, the product is not available for installment payments.  Each number represents a month.
	 */
	payOverTimePlan?: number[];
	/**
	 * ex: 3 means a 3 month supply
	 */
	monthSupply: number;
	/**
	 * Used by WP
	 */
	sku?: string;
	/**
	 * Used by Prescribery
	 */
	prescriberyTemplate?: string;
	prescriberySource?: string;
	/**
	 * Used by Trinity
	 */
	trinityId?: TrinityProduct;
};

export function getPayInFullProductPrice(product: Product) {
	return product.retailPrice * product.monthSupply;
}

export function getPayOverTimeProductPrice(product: Product, month: number) {
	if (!product.payOverTimePlan) {
		if (month === 0) {
			return getPayInFullProductPrice(product);
		}
		return 0;
	}
	const amount = product.payOverTimePlan[month];
	return amount || 0;
}
