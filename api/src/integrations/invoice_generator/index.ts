import { v2 as cloudinary } from 'cloudinary';
import db from '../../infrastructure/db';
import { getProductFromId, ProductId } from '../../resources/products';
import { orderCollection } from '../../orders/collection';
import { BadRequest } from '../../infrastructure/common/errors';

cloudinary.config({
	cloud_name: 'hbkb9nmhk',
	api_key: '821345533251367',
	api_secret: 'TBTZPBX1OMgUhoS1at69_XUiOjo', // Click 'View API Keys' above to copy your API secret
});

type ReceiptCollection = {
	createdAt: Date;
	email: string;
	productId: ProductId;
	amount: number;
	date: string;
	receiptNumber: number;
};
const receiptCollection = db.collection<ReceiptCollection>('receipt');

export async function generateReceipt({
	email,
	productId,
	amount,
	date,
}: {
	email: string;
	productId: ProductId;
	amount: number;
	date: string;
}) {
	const order = await orderCollection.findOne(
		{
			'personalInfo.user.email': email,
		},
		{
			sort: {
				createdAt: -1,
			},
		},
	);

	const mostRecentReceipt = await receiptCollection.findOne(
		{},
		{
			sort: {
				createdAt: -1,
			},
		},
	);

	const receiptNumber = mostRecentReceipt ? mostRecentReceipt.receiptNumber + 1 : 1274;

	if (!order) {
		throw new Error('Payment request not found');
	}

	const { user, shipping, billing } = order.personalInfo;

	const product = getProductFromId(productId);

	if (!product) {
		throw new BadRequest('Invalid product ID');
	}

	// Construct the form data as URL-encoded parameters
	const params = new URLSearchParams({
		from: `EllieMD
3790 El Camino Real PO #1099
Palo Alto, CA 94306
+1 -888-588-5175
www.elliemd.com`,
		to: `${user.firstName} ${user.lastName}\n${billing.address}\n${billing.city}, ${billing.stateCode} ${billing.postcode}`,
		ship_to: `${user.firstName} ${user.lastName}\n${shipping.address}\n${shipping.city}, ${shipping.stateCode} ${shipping.postcode}`,
		header: 'Receipt',
		logo: 'https://elliemd.com/wp-content/uploads/2024/05/FINAL.svg',
		number: receiptNumber.toString(),
		currency: 'USD',
		date,
		'items[0][name]': `${product.name}${product.tier ? ` (Tier ${product.tier})` : ''}`,
		'items[0][quantity]': '1',
		'items[0][unit_cost]': amount.toString(),
		amount_paid: amount.toString(),
		notes: 'Prescription medication is shipped from the fulfillment pharmacy.',
		terms: 'For any questions or assistance please contact EllieMD at support@elliemd.com',
	});

	try {
		const invoiceUrl = 'https://invoice-generator.com';
		const invoiceApiKey = 'sk_4kdOSKBVGuRVeETFEKyg44Um125LT8Js';

		// Send the POST request to generate the invoice PDF
		const response = await fetch(invoiceUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${invoiceApiKey}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: params.toString(),
		});

		// Check if the response is successful
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Request failed with status ${response.status}: ${errorText}`);
		}

		// Read the response as an ArrayBuffer
		const arrayBuffer = await response.arrayBuffer();

		// Convert ArrayBuffer to Buffer
		const buffer = Buffer.from(arrayBuffer);

		// Convert Buffer to Base64
		const base64 = buffer.toString('base64');
		const dataUri = `data:application/pdf;base64,${base64}`;

		// Upload the PDF to Cloudinary
		const uploadResult = await cloudinary.uploader.upload(dataUri, {
			resource_type: 'raw', // Use 'raw' for non-image files like PDFs
			folder: 'receipts', // Optional: specify a folder in Cloudinary
			public_id: `receipt_${receiptNumber}.pdf`, // Optional: specify a public ID
		});

		// Save the invoice to the database
		await receiptCollection.insertOne({
			createdAt: new Date(),
			email,
			productId,
			amount,
			date,
			receiptNumber,
		});

		console.log('Invoice uploaded to Cloudinary:', uploadResult.secure_url);
		return uploadResult.secure_url;
	} catch (error) {
		console.error('Error generating or uploading invoice:', error);
		return 'Error generating or uploading invoice';
	}
}
