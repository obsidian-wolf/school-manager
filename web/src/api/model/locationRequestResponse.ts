/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * school-manager-api
 * OpenAPI spec version: 1.0
 */
import type { LocationRequestResponsePathsItem } from './locationRequestResponsePathsItem';
import type { LocationRequestResponseType } from './locationRequestResponseType';

export interface LocationRequestResponse {
    defaultPath?: number;
    paths?: LocationRequestResponsePathsItem[];
    payload?: string;
    time?: number;
    /** */
    type: LocationRequestResponseType;
}