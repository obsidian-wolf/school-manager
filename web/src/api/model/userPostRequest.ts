/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * pam-ai-whatsapp
 * OpenAPI spec version: 1.0.0
 */
import type { UserPostRequestContactInfo } from './userPostRequestContactInfo';

export interface UserPostRequest {
    contact_info: UserPostRequestContactInfo;
    first_name?: string;
    password?: string;
    surname?: string;
    user_name?: string;
    user_persona?: unknown;
    [key: string]: unknown;
}