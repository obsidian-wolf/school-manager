/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * school-manager-api
 * OpenAPI spec version: 1.0
 */
import type { StudentGender } from './studentGender';
import type { ObjectId } from './objectId';

export interface Student {
    date_of_birth: string;
    gender: StudentGender;
    grade: number;
    id: string;
    name: string;
    surname: string;
    teacher_id: ObjectId;
}