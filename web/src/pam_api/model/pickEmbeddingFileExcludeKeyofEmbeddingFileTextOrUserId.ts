/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * pam-ai-whatsapp
 * OpenAPI spec version: 1.0.0
 */
import type { PickEmbeddingFileExcludeKeyofEmbeddingFileTextOrUserIdStatus } from './pickEmbeddingFileExcludeKeyofEmbeddingFileTextOrUserIdStatus';

/**
 * From T, pick a set of properties whose keys are in the union K
 */
export interface PickEmbeddingFileExcludeKeyofEmbeddingFileTextOrUserId {
    callback_url?: string;
    created_at: string;
    file_name: string;
    location: string;
    md5: string;
    status: PickEmbeddingFileExcludeKeyofEmbeddingFileTextOrUserIdStatus;
    tag?: string;
    text_file_id?: string;
}