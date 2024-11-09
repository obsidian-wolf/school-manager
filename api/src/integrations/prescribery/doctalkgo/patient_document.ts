import FormData from 'form-data';
import axios from 'axios';
import mime from 'mime-types';
import path from 'path';
import config from '../../../config';
import { getAccessToken } from './auth';
import { BadRequest } from '../../../infrastructure/common/errors';

export async function createPatientDocument(patientId: string, fileUrl: string, title: string) {
	// Download the image as a buffer
	const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
	const fileBuffer = Buffer.from(response.data);

	// Parse the URL
	const parsedUrl = new URL(fileUrl);
	const pathname = parsedUrl.pathname;
	const filename = path.basename(pathname); // e.g., 'prescription-3-150x150.jpg'

	// Create form data
	const formData = new FormData();
	formData.append('patient_id', patientId.toString());
	formData.append('title', title);

	formData.append('document_file', fileBuffer, {
		filename,
		contentType: mime.lookup(filename) as string,
	});

	const { data } = await axios.post<CreateDocumentResponse>(
		`${config.PRESCRIBERY_API_URL}/patients/documents/${patientId}`,
		formData,
		{
			headers: {
				...formData.getHeaders(), // To properly set the boundaries for multipart data
				Authorization: `Bearer ${(await getAccessToken()).access_token}`,
			},
		},
	);
	if (!data.patient_document) {
		throw new BadRequest(JSON.stringify(data));
	}
	return data.patient_document;
}

export type CreateDocumentResponse = {
	code: number;
	message: string;
	patient_document: {
		document_id: number;
		document_file: string;
		title: string;
	};
};

// 3958
