'use client';
import { useRef, useState } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useDeleteParent, useGetParents } from '~/api/endpoints';
import { CreateParent } from './create_parent';
import { UpdateParent } from './update_parent';
import { Link } from 'react-router-dom';

export default function ParentsPage() {
    const [deletingParentId, setDeletingParentId] = useState<string | undefined>();

    const parentsQuery = useGetParents();

    const deleteParentQuery = useDeleteParent();

    async function onParentDelete(id: string) {
        try {
            setDeletingParentId(id);
            await deleteParentQuery.mutateAsync({ parentId: id });
            parentsQuery.refetch();
        } finally {
            setDeletingParentId(undefined);
        }
    }

    const createParentRef = useRef<HTMLDialogElement>(null);
    const updateParentRef = useRef<HTMLDialogElement>(null);
    const [updatingParentId, setUpdatingParentId] = useState<string | undefined>(undefined);
    const updatingParent = parentsQuery.data?.find((p) => p.id === updatingParentId);

    return (
        <>
            <CreateParent ref={createParentRef} />
            <UpdateParent
                ref={updateParentRef}
                parent={updatingParent}
                onClose={() => {
                    setUpdatingParentId(undefined);
                }}
            />

            {!parentsQuery.data ? (
                <div className="loading loading-spinner" />
            ) : (
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Type</th>
                            <th>Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parentsQuery.data.map((parent) => {
                            return (
                                <tr key={parent.id}>
                                    <td>{parent.name}</td>
                                    <td>{parent.surname}</td>
                                    <td>{parent.email}</td>
                                    <td>{parent.phone}</td>
                                    <td>{parent.type === 'admin' ? 'Admin' : 'Parent'}</td>
                                    <td>
                                        <Link
                                            to={`/parents/${parent.id}`}
                                            className="btn btn-link btn-sm"
                                        >
                                            {' '}
                                            {parent.students.length}{' '}
                                        </Link>
                                    </td>
                                    <td className="space-x-2 whitespace-nowrap">
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-sm w-10"
                                            disabled={updatingParentId === parent.id}
                                            onClick={() => {
                                                setUpdatingParentId(parent.id);
                                                updateParentRef.current?.showModal();
                                            }}
                                        >
                                            <PencilSquareIcon className="h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-error btn-sm w-10"
                                            disabled={deletingParentId === parent.id}
                                            onClick={() => onParentDelete(parent.id)}
                                        >
                                            {parent.id === deletingParentId ? (
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
                onClick={() => createParentRef.current?.showModal()}
            >
                Create New Parent
            </button>
        </>
    );
}
