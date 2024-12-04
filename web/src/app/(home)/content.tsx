'use client';
import { useDeleteFile, useEmbedFile, useListFiles, useUploadFile } from '~/pam_api/endpoints';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import customInstance from '~/pam_api/custom_instance';
import { FolderArrowDownIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useLogout } from '~/auth_store';

export function HomePageContent() {
    const list = useListFiles();
    const uploadFile = useUploadFile();
    const embedFile = useEmbedFile();
    const [file, setFile] = useState<File | undefined>(undefined);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const deleteFile = useDeleteFile();
    const [deletingFileId, setDeletingFileId] = useState<string | undefined>();
    const [downloadingFileId, setDownloadingFileId] = useState<string | undefined>();

    const logout = useLogout();

    const isLoading = list.isLoading || uploadFile.isPending || embedFile.isPending;

    async function onFileDelete(id: string) {
        try {
            setDeletingFileId(id);
            await deleteFile.mutateAsync({ id });
            list.refetch();
        } finally {
            setDeletingFileId(undefined);
        }
    }

    async function onUploadFile(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (!file) return;
        await uploadFile.mutateAsync(
            {
                data: {
                    file,
                },
            },
            {
                onSuccess: async () => {
                    // await embedFile.mutateAsync({ id });
                    fileUploadRef.current!.value = '';
                    setFile(undefined);
                    dialogRef.current?.close();

                    list.refetch();
                },
            },
        );
    }

    async function onDownloadFile(id: string, fileName: string) {
        setDownloadingFileId(id);
        const data = await customInstance<ArrayBuffer>({
            url: `/embedding/download/${id}`,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        const blob = new Blob([data], { type: 'application/octet-stream' });

        // Create a link element
        const link = document.createElement('a');

        // Set the download attribute with a filename
        link.download = fileName;

        // Create a URL for the Blob and set it as the href attribute
        link.href = window.URL.createObjectURL(new File([blob], fileName));

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
        setDownloadingFileId(undefined);
    }

    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <div className="flex h-screen">
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    <form
                        method="dialog"
                        onSubmit={() => {
                            fileUploadRef.current!.value = '';
                            setFile(undefined);
                        }}
                    >
                        {/* if there is a button in form, it will close the modal */}
                        <button
                            type="submit"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Upload New File</h3>
                    <div className="space-x-4 flex pt-8">
                        <input
                            disabled={isLoading}
                            onChange={(e) => {
                                // embed file
                                const file = e.target.files?.[0];
                                setFile(file);
                            }}
                            ref={fileUploadRef}
                            type="file"
                            className="file-input max-w-full w-full file-input-ghost"
                        />
                    </div>
                    <div className="modal-action space-x-4">
                        <form method="dialog">
                            <button
                                type="button"
                                className="btn btn-neutral btn-outline"
                                disabled={!file || isLoading}
                                onClick={onUploadFile}
                            >
                                Upload
                                {isLoading && <span className="loading loading-spinner"></span>}
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>

            <nav className="h-full shadow bg-stone-100">
                <div className="p-4 text-xl">School Manager</div>
                <ul className="menu w-56 space-y-2">
                    <li>
                        <a className="active">Files</a>
                    </li>
                    <li>
                        <Link to="/chat">Go to chat</Link>
                    </li>
                    <li>
                        <a onClick={() => logout()}>Logout</a>
                    </li>
                </ul>
            </nav>

            <main className="flex-1 p-4">
                {!list.data ? (
                    <div className="loading loading-spinner" />
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.data.map((file) => (
                                <tr key={file.id}>
                                    <td>{file.file_name}</td>
                                    <td className="space-x-2">
                                        <button
                                            type="button"
                                            className={clsx(`btn btn-outline btn-sm w-10"`)}
                                            disabled={downloadingFileId === file.id}
                                            onClick={() => onDownloadFile(file.id, file.file_name)}
                                        >
                                            {file.id === downloadingFileId ? (
                                                <span className="loading loading-spinner"></span>
                                            ) : (
                                                <FolderArrowDownIcon className="h-4" />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-error btn-sm w-10"
                                            disabled={deletingFileId === file.id}
                                            onClick={() => onFileDelete(file.id)}
                                        >
                                            {file.id === deletingFileId ? (
                                                <span className="loading loading-spinner"></span>
                                            ) : (
                                                <TrashIcon className="h-4" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="divider"></div>
                <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => dialogRef.current?.showModal()}
                >
                    Upload New File
                </button>
            </main>
        </div>
    );
}
