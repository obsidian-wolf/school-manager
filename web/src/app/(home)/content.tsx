'use client';
import { useDeleteFile, useListFiles, useUploadFile } from '@/api/endpoints';
import clsx from 'clsx';
import { useRef, useState } from 'react';

export function HomePageContent() {
	const list = useListFiles();
	const uploadFile = useUploadFile();
	const [file, setFile] = useState<File | undefined>(undefined);
	const fileUploadRef = useRef<HTMLInputElement>(null);
	const deleteFile = useDeleteFile();
	const [deletingFileId, setDeletingFileId] = useState<string | undefined>();

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
				onSuccess: () => {
					fileUploadRef.current!.value = '';
					setFile(undefined);

					list.refetch();
				},
			}
		);
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
										<button className={clsx(`btn btn-primary btn-sm`)}>
											Download
										</button>
										<button
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
						disabled={uploadFile.isPending}
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
						className="btn btn-primary btn-sm"
						disabled={!file || uploadFile.isPending}
						onClick={onUploadFile}
					>
						Upload
						{uploadFile.isPending && <span className="loading loading-spinner"></span>}
					</button>
				</div>
			</div>
		</div>
	);
}
