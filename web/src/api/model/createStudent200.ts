/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * school-manager-api
 * OpenAPI spec version: 1.0
 */
import type { CreateStudent200StudentsItem } from './createStudent200StudentsItem';
import type { CreateStudent200Type } from './createStudent200Type';

export type CreateStudent200 = {
    email: string;
    id: string;
    name: string;
    password: string;
    phone: string;
    students: CreateStudent200StudentsItem[];
    surname: string;
    type: CreateStudent200Type;
};