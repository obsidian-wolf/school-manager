import { forwardRef, useState } from 'react';
import { useCreateParent, useGetParents } from '~/api/endpoints';
import { CreateParentRequest } from '~/api/model';

export const CreateParent = forwardRef<HTMLDialogElement>((_, ref) => {
    const [parent, setParent] = useState<CreateParentRequest>({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogRef = (ref as any).current as HTMLDialogElement;

    const { refetch } = useGetParents();
    const createParentQuery = useCreateParent({
        mutation: {
            onSuccess: () => {
                refetch();
            },
        },
    });

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!parent.name || !parent.surname || !parent.email || !parent.phone || !parent.password) {
            alert('Please fill all fields');
            return;
        }
        await createParentQuery.mutateAsync({
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
                <h3 className="font-bold text-lg">Create Parent</h3>
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
                            <span className="label-text">Email</span>
                        </div>
                        <input
                            className="input input-bordered"
                            type="email"
                            value={parent.email}
                            onChange={(e) => setParent({ ...parent, email: e.target.value })}
                        />
                    </label>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Phone</span>
                        </div>
                        <input
                            className="input input-bordered"
                            type="text"
                            value={parent.phone}
                            onChange={(e) => setParent({ ...parent, phone: e.target.value })}
                        />
                    </label>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Password</span>
                        </div>
                        <input
                            className="input input-bordered"
                            type="password"
                            value={parent.password}
                            onChange={(e) => setParent({ ...parent, password: e.target.value })}
                        />
                    </label>
                </div>
                <div className="modal-action space-x-4">
                    <form onSubmit={onSubmit}>
                        <button
                            type="submit"
                            className="btn btn-neutral btn-outline"
                            disabled={createParentQuery.isPending}
                        >
                            Create
                            {createParentQuery.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
});

CreateParent.displayName = 'CreateParent';
