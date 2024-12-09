'use client';
import { useRef, useState } from 'react';
import { ChevronLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useDeleteStudent, useGetParents, useGetTeachers } from '~/api/endpoints';
import { CreateStudent } from './create_student';
import { UpdateStudent } from './update_student';
import { Link, useParams } from 'react-router-dom';

export default function StudentsPage() {
    const [deletingStudentId, setDeletingStudentId] = useState<string | undefined>();

    const { id } = useParams();
    const parentsQuery = useGetParents();
    const parent = parentsQuery.data?.find((p) => p.id === id);

    const deleteStudentQuery = useDeleteStudent();

    const teachersQuery = useGetTeachers();

    async function onStudentDelete(id: string) {
        try {
            setDeletingStudentId(id);
            await deleteStudentQuery.mutateAsync({ parentId: parent?.id || '', studentId: id });
            parentsQuery.refetch();
        } finally {
            setDeletingStudentId(undefined);
        }
    }

    const createStudentRef = useRef<HTMLDialogElement>(null);
    const updateStudentRef = useRef<HTMLDialogElement>(null);
    const [updatingStudentId, setUpdatingStudentId] = useState<string | undefined>(undefined);
    const updatingStudent = parent?.students?.find((p) => p.id === updatingStudentId);

    return (
        <>
            <div className="pb-4">
                <div className="flex gap-6 items-center">
                    <Link className="btn btn-outline btn-sm" type="button" to="/parents">
                        <ChevronLeftIcon className="h-4" />
                    </Link>
                    <div className="text-2xl">
                        {parent?.name} {parent?.surname}
                    </div>
                </div>
            </div>
            <CreateStudent ref={createStudentRef} parentId={parent?.id || ''} />
            <UpdateStudent
                ref={updateStudentRef}
                student={updatingStudent}
                parentId={parent?.id || ''}
                onClose={() => {
                    setUpdatingStudentId(undefined);
                }}
            />
            {!parent ? (
                <div className="loading loading-spinner" />
            ) : (
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Grade</th>
                            <th>Teacher</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {parent.students.map((student) => {
                            const teacher = teachersQuery.data?.find(
                                (t) => t.id === student.teacher_id,
                            );

                            return (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.surname}</td>
                                    <td>{student.grade}</td>
                                    <td>
                                        {teacher?.name} {teacher?.surname}
                                    </td>
                                    <td className="space-x-2 whitespace-nowrap">
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-sm w-10"
                                            disabled={updatingStudentId === student.id}
                                            onClick={() => {
                                                setUpdatingStudentId(student.id);
                                                updateStudentRef.current?.showModal();
                                            }}
                                        >
                                            <PencilSquareIcon className="h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-error btn-sm w-10"
                                            disabled={deletingStudentId === student.id}
                                            onClick={() => onStudentDelete(student.id)}
                                        >
                                            {student.id === deletingStudentId ? (
                                                <span className="loading loading-spinner"></span>
                                            ) : (
                                                <TrashIcon className="h-4" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <div className="divider"></div>
            <button
                className="btn btn-outline"
                type="button"
                onClick={() => createStudentRef.current?.showModal()}
            >
                Create New Student
            </button>
        </>
    );
}
