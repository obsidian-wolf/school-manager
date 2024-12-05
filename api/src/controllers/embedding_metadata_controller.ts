import { Route, Tags, Path, Get, Post, Body, Request, Security, Delete, Query } from 'tsoa';

import { AuthedRequest } from '../infrastructure/server/middlewares/authentication_middleware';
import {
	deleteEmbedding,
	getEmbeddings,
	saveEmbedding,
	saveSummary,
	setEmbeddedStatus,
	SetEmbeddedStatus,
} from '../services/embeddings';

export type SaveSummary = {
	text: string;
};

@Route('embedding-metadata')
@Tags('EmbeddingMetadata')
export class EmbeddingMetadataController {
	@Post('/{id}/summary')
	@Security('jwt')
	public async saveSummary(
		@Request() request: AuthedRequest,
		@Path() id: string,
		@Body() body: SaveSummary,
	) {
		return await saveSummary(request.user, id, body.text);
	}

	@Get('/')
	@Security('jwt')
	public async getEmbeddingMetadata(@Request() request: AuthedRequest) {
		return await getEmbeddings(request.user);
	}

	@Post('/{id}')
	@Security('jwt')
	public async createEmbeddingMetadata(
		@Request() request: AuthedRequest,
		@Path() id: string,
		@Query() isPending?: boolean,
	) {
		await saveEmbedding(request.user, id, isPending);
	}

	@Post('/')
	public async embeddingWebhook(@Body() body: SetEmbeddedStatus) {
		await setEmbeddedStatus(body);
	}

	@Delete('/{id}')
	@Security('jwt')
	public async deleteEmbeddingMetadata(@Request() request: AuthedRequest, @Path() id: string) {
		await deleteEmbedding(request.user, id);
	}
}
