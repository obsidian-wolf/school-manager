'use client';
import { useDeleteFile, useEmbedFile, useListFiles, useUploadFile } from '~/pam_api/endpoints';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import customInstance from '~/pam_api/custom_instance';

export function HomePageContent() {
    const list = useListFiles();
    const uploadFile = useUploadFile();
    const embedFile = useEmbedFile();
    const [file, setFile] = useState<File | undefined>(undefined);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const deleteFile = useDeleteFile();
    const [deletingFileId, setDeletingFileId] = useState<string | undefined>();
    const [downloadingFileId, setDownloadingFileId] = useState<string | undefined>();

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

    async function onUploadFile() {
        if (!file) return;
        await uploadFile.mutateAsync(
            {
                data: {
                    file,
                },
            },
            {
                onSuccess: async (id) => {
                    await embedFile.mutateAsync({ id });
                    fileUploadRef.current!.value = '';
                    setFile(undefined);

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

    return (
        <div>
            <div className="navbar bg-base-100">
                <a className="btn btn-ghost text-xl">School Manager</a>
            </div>

            <div className="container mx-auto px-4">
                {!list.data ? (
                    <div className="loading loading-spinner" />
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.data.map((file) => (
                                <tr key={file.id}>
                                    <td>{file.id}</td>
                                    <td>{file.file_name}</td>
                                    <td className="space-x-2">
                                        <button
                                            type="button"
                                            className={clsx(`btn btn-primary btn-sm`)}
                                            disabled={downloadingFileId === file.id}
                                            onClick={() => onDownloadFile(file.id, file.file_name)}
                                        >
                                            Download
                                            {file.id === downloadingFileId && (
                                                <span className="loading loading-spinner"></span>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-error btn-sm"
                                            disabled={deletingFileId === file.id}
                                            onClick={() => onFileDelete(file.id)}
                                        >
                                            Delete
                                            {file.id === deletingFileId && (
                                                <span className="loading loading-spinner"></span>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="divider"></div>
                <div className="space-x-4">
                    <input
                        disabled={isLoading}
                        onChange={(e) => {
                            // embed file
                            const file = e.target.files?.[0];
                            setFile(file);
                        }}
                        ref={fileUploadRef}
                        type="file"
                        className="file-input w-full max-w-xs"
                    />
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={!file || isLoading}
                        onClick={onUploadFile}
                    >
                        Upload
                        {isLoading && <span className="loading loading-spinner"></span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
