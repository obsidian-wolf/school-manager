import { forwardRef, useEffect, useState } from 'react';
import { useGetParents, useUpdateParent } from '~/api/endpoints';
import { GetParents200Item, UpdateParentRequest } from '~/api/model';

function convertToUpdateParentRequest(parent?: GetParents200Item): UpdateParentRequest {
    return {
        name: parent?.name || '',
        surname: parent?.surname || '',
        phone: parent?.phone || '',
    };
}

export const UpdateParent = forwardRef<
    HTMLDialogElement,
    { parent?: GetParents200Item; onClose: () => void }
>(({ parent: initialParent, onClose }, ref) => {
    const [parent, setParent] = useState<UpdateParentRequest>(convertToUpdateParentRequest);

    useEffect(() => {
        if (initialParent) {
            setParent(convertToUpdateParentRequest(initialParent));
        } else {
            setParent(convertToUpdateParentRequest());
        }
    }, [initialParent]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogRef = (ref as any).current as HTMLDialogElement;

    const { refetch } = useGetParents();
    const updateParentQuery = useUpdateParent({
        mutation: {
            onSuccess: () => {
                refetch();
            },
        },
    });

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!initialParent) return;
        if (!parent.name || !parent.surname || !parent.phone) {
            alert('Please fill all fields');
            return;
        }
        try {
            await updateParentQuery.mutateAsync({
                parentId: initialParent.id,
                data: parent,
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
                            <span className="label-text">Phone</span>
                        </div>
                        <input
                            className="input input-bordered"
                            type="text"
                            value={parent.phone}
                            onChange={(e) => setParent({ ...parent, phone: e.target.value })}
                        />
                    </label>
                </div>
                <div className="modal-action space-x-4">
                    <form onSubmit={onSubmit}>
                        <button
                            type="submit"
                            className="btn btn-neutral btn-outline"
                            disabled={updateParentQuery.isPending}
                        >
                            Update
                            {updateParentQuery.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
});

UpdateParent.displayName = 'UpdateParent';
