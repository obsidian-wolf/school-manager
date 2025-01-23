'use client';
import {
    summarize,
    useDeleteFile,
    useEmbedFile,
    useListFiles,
    useUploadFile,
} from '~/pam_api/endpoints';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import customInstance from '~/pam_api/custom_instance';
import {
    CheckBadgeIcon,
    DocumentTextIcon,
    FolderArrowDownIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';
import {
    createEmbeddingMetadata,
    deleteEmbeddingMetadata,
    saveSummary,
    useGetEmbeddingMetadata,
} from '~/api/endpoints';
import { API_URL } from '~/config';

export function HomePageContent() {
    const list = useListFiles();
    const uploadFile = useUploadFile();
    const embedFile = useEmbedFile();
    const [file, setFile] = useState<File | undefined>(undefined);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const deleteFile = useDeleteFile();
    const [deletingFileId, setDeletingFileId] = useState<string | undefined>();
    const [downloadingFileId, setDownloadingFileId] = useState<string | undefined>();
    const { data: embeddings, refetch: refetchEmbeddings } = useGetEmbeddingMetadata({
        query: {
            refetchInterval: 5000,
        },
    });

    const isLoading = list.isLoading || uploadFile.isPending || embedFile.isPending;

    async function onFileDelete(id: string) {
        try {
            setDeletingFileId(id);
            await deleteFile.mutateAsync({ id });
            try {
                await deleteEmbeddingMetadata(id);
            } catch {
                //
            }
            list.refetch();
            refetchEmbeddings();
        } finally {
            setDeletingFileId(undefined);
        }
    }

    useEffect(() => {
        (async () => {
            if (!list.data || !embeddings) return;

            await new Promise((resolve) => setTimeout(resolve, 2000));

            await Promise.all(
                list.data.map(async (file) => {
                    const embedding = embeddings?.find((e) => e.pam_id === file.id);

                    if (!embedding) {
                        await createEmbeddingMetadata(file.id, {
                            isPending: false,
                        });
                    }

                    if (!embedding?.summary) {
                        await refetchEmbeddings();

                        const summary = await summarize(file.id);

                        await saveSummary(file.id, { text: summary });
                    }
                }),
            );
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!list.data && !!embeddings]);

    async function onUploadFile(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (!file) return;
        await uploadFile.mutateAsync(
            {
                data: {
                    file,
                },
                params: {
                    callbackUrl: 'https://52cd74a92b6e.ngrok.app/embedding-metadata', // `${API_URL}/embedding-metadata`,
                },
            },
            {
                onSuccess: async (id) => {
                    fileUploadRef.current!.value = '';
                    setFile(undefined);
                    dialogRef.current?.close();

                    list.refetch();

                    (async () => {
                        await createEmbeddingMetadata(id);
                        await refetchEmbeddings();

                        const summary = await summarize(id);

                        await saveSummary(id, { text: summary });
                    })();
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
    const summaryRef = useRef<HTMLDialogElement>(null);
    const [summary, setSummary] = useState<string | undefined>(undefined);

    return (
        <>
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

            <dialog ref={summaryRef} className="modal">
                <div className="modal-box">
                    <form
                        method="dialog"
                        onSubmit={() => {
                            setSummary(undefined);
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
                    <h3 className="font-bold text-lg">Summary</h3>
                    <div className="space-x-4 flex pt-4">{summary}</div>
                </div>
            </dialog>

            {!list.data ? (
                <div className="loading loading-spinner" />
            ) : (
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.data.map((file) => {
                            const embedding = embeddings?.find((e) => e.pam_id === file.id);

                            return (
                                <tr key={file.id}>
                                    <td className="max-w-60 truncate">{file.file_name}</td>
                                    <td>
                                        {embedding?.is_pending ? (
                                            <span className="loading loading-dots loading-md"></span>
                                        ) : (
                                            <CheckBadgeIcon className="h-6" />
                                        )}
                                    </td>
                                    <td className="space-x-2 whitespace-nowrap">
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
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-success btn-sm w-10"
                                            disabled={!embedding?.summary}
                                            onClick={() => {
                                                setSummary(embedding?.summary);
                                                summaryRef.current?.showModal();
                                            }}
                                        >
                                            <DocumentTextIcon className="h-4" />
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
                onClick={() => dialogRef.current?.showModal()}
            >
                Upload New File
            </button>
        </>
    );
}
