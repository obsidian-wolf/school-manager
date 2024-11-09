const AFTERPAY_MPID =
	process.env.NEXT_PUBLIC_AFTERPAY_MPID || 'a2a3014a-9b3d-4fe7-a7db-e9b945cc3d0b';
const AFTERPAY_PLACEMENT_ID =
	process.env.NEXT_PUBLIC_PLACEMENT_ID || '62f73f2f-2f42-4825-a4b8-10b2f72f7a89';
const AFTERPAY_SCRIPT =
	process.env.NEXT_PUBLIC_AFTERPAY_SCRIPT ||
	'https://js-sandbox.squarecdn.com/square-marketplace.js';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const NEXIO_URL = process.env.NEXT_PUBLIC_NEXIO_URL || 'https://api.nexiopaysandbox.com';

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://dev.elliemd.com';

export { BASE_URL, NEXIO_URL, AFTERPAY_SCRIPT, AFTERPAY_MPID, AFTERPAY_PLACEMENT_ID, WEBSITE_URL };
