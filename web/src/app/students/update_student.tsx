import { forwardRef, useEffect, useState } from 'react';
import { useGetParents, useGetTeachers, useUpdateStudent } from '~/api/endpoints';
import {
    GetParents200ItemStudentsItem,
    UpdateStudentRequest,
    UpdateStudentRequestGender,
} from '~/api/model';
import { times } from '~/utils/times';
import { format } from 'date-fns';

function convertToUpdateStudentRequest(
    parent?: GetParents200ItemStudentsItem,
): UpdateStudentRequest {
    return {
        name: parent?.name || '',
        surname: parent?.surname || '',
        grade: parent?.grade || 0,
        teacher_id: parent?.teacher_id || '',
        date_of_birth: parent?.date_of_birth
            ? format(new Date(parent.date_of_birth), 'yyyy-MM-dd')
            : '',
        gender: parent?.gender || 'Male',
    };
}

export const UpdateStudent = forwardRef<
    HTMLDialogElement,
    { parentId: string; student?: GetParents200ItemStudentsItem; onClose: () => void }
>(({ student: initialStudent, parentId, onClose }, ref) => {
    const [student, setStudent] = useState<UpdateStudentRequest>(convertToUpdateStudentRequest);

    useEffect(() => {
        if (initialStudent) {
            setStudent(convertToUpdateStudentRequest(initialStudent));
        } else {
            setStudent(convertToUpdateStudentRequest());
        }
    }, [initialStudent]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogRef = (ref as any).current as HTMLDialogElement;

    const teachersQuery = useGetTeachers();

    const { refetch } = useGetParents();
    const updateStudentQuery = useUpdateStudent({
        mutation: {
            onSuccess: () => {
                refetch();
            },
        },
    });

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!initialStudent) return;
        if (
            !student.name ||
            !student.surname ||
            !student.teacher_id ||
            !student.date_of_birth ||
            !student.gender ||
            student.grade === undefined
        ) {
            alert('Please fill all fields');
            return;
        }
        try {
            await updateStudentQuery.mutateAsync({
                studentId: initialStudent.id,
                parentId,
                data: student,
            });
            onClose();
            dialogRef!.close();
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorMessage = (error as any)?.response?.data?.message;
            alert(typeof errorMessage === 'string' ? errorMessage : 'An error occurred');
        }
    }

    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button
                        type="submit"
                        onClick={() => {
                            onClose();
                        }}
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Update Student</h3>
                <div className="gap-0 flex pt-4 flex-col">
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Name</span>
                        </div>
                        <input
                            className="input input-bordered"
                            type="text"
                            value={student.name}
                            onChange={(e) => setStudent({ ...student, name: e.target.value })}
                        />
                    </label>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Surname</span>
                        </div>
                        <input
                            className="input input-bordered"
                            type="text"
                            value={student.surname}
                            onChange={(e) => setStudent({ ...student, surname: e.target.value })}
                        />
                    </label>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Grade</span>
                        </div>

                        <select
                            className="select select-bordered"
                            value={student.grade}
                            onChange={(e) =>
                                setStudent({ ...student, grade: Number(e.target.value) })
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
                            value={student.date_of_birth}
                            onChange={(e) =>
                                setStudent({ ...student, date_of_birth: e.target.value })
                            }
                        />
                    </label>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Gender</span>
                        </div>
                        <select
                            className="select select-bordered"
                            value={student.grade}
                            onChange={(e) =>
                                setStudent({
                                    ...student,
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
                            value={student.teacher_id}
                            onChange={(e) =>
                                setStudent({
                                    ...student,
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
                            disabled={updateStudentQuery.isPending}
                        >
                            Update
                            {updateStudentQuery.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
});

UpdateStudent.displayName = 'UpdateParent';
