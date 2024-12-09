import { forwardRef, useState } from 'react';
import { useCreateStudent, useGetParents, useGetTeachers } from '~/api/endpoints';
import { CreateStudentRequest, UpdateStudentRequestGender } from '~/api/model';
import { times } from '~/utils/times';

export const CreateStudent = forwardRef<HTMLDialogElement, { parentId: string }>(
    ({ parentId }, ref) => {
        const [parent, setParent] = useState<CreateStudentRequest>({
            date_of_birth: new Date().toISOString(),
            gender: 'Male',
            grade: 0,
            name: '',
            surname: '',
            teacher_id: '',
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dialogRef = (ref as any).current as HTMLDialogElement;

        const teachersQuery = useGetTeachers();

        const { refetch } = useGetParents();
        const createStudentQuery = useCreateStudent({
            mutation: {
                onSuccess: () => {
                    refetch();
                },
            },
        });

        async function onSubmit(e: React.FormEvent) {
            e.preventDefault();
            if (
                !parent.name ||
                !parent.surname ||
                !parent.teacher_id ||
                !parent.date_of_birth ||
                !parent.gender ||
                parent.grade === undefined
            ) {
                alert('Please fill all fields');
                return;
            }
            await createStudentQuery.mutateAsync({
                parentId: parentId,
                data: parent,
            });
            dialogRef!.close();
        }

        return (
            <dialog ref={ref} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button
                            type="submit"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Create Student</h3>
                    <div className="gap-0 flex pt-4 flex-col">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Name</span>
                            </div>
                            <input
                                className="input input-bordered"
                                type="text"
                                value={parent.name}
                                onChange={(e) => setParent({ ...parent, name: e.target.value })}
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Surname</span>
                            </div>
                            <input
                                className="input input-bordered"
                                type="text"
                                value={parent.surname}
                                onChange={(e) => setParent({ ...parent, surname: e.target.value })}
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Grade</span>
                            </div>

                            <select
                                className="select select-bordered"
                                value={parent.grade}
                                onChange={(e) =>
                                    setParent({ ...parent, grade: Number(e.target.value) })
                                }
                            >
                                {times(13, (i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Date of Birth</span>
                            </div>
                            <input
                                className="input input-bordered"
                                type="date"
                                value={parent.date_of_birth}
                                onChange={(e) =>
                                    setParent({ ...parent, date_of_birth: e.target.value })
                                }
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Gender</span>
                            </div>
                            <select
                                className="select select-bordered"
                                value={parent.grade}
                                onChange={(e) =>
                                    setParent({
                                        ...parent,
                                        gender: e.target.value as UpdateStudentRequestGender,
                                    })
                                }
                            >
                                <option value={''} disabled>
                                    ---
                                </option>
                                <option value={'Male'}>Male</option>
                                <option value={'Female'}>Female</option>
                            </select>
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Teacher</span>
                            </div>
                            <select
                                className="select select-bordered"
                                value={parent.teacher_id}
                                onChange={(e) =>
                                    setParent({
                                        ...parent,
                                        teacher_id: e.target.value,
                                    })
                                }
                            >
                                <option value={''} disabled>
                                    ---
                                </option>
                                {teachersQuery.data?.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} {teacher.surname}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="modal-action space-x-4">
                        <form onSubmit={onSubmit}>
                            <button
                                type="submit"
                                className="btn btn-neutral btn-outline"
                                disabled={createStudentQuery.isPending}
                            >
                                Create
                                {createStudentQuery.isPending && (
                                    <span className="loading loading-spinner"></span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        );
    },
);

CreateStudent.displayName = 'CreateStudent';
