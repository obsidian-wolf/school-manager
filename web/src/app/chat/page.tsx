'use client';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export const api = axios.create({
	baseURL: 'https://general-runtime.voiceflow.com',
	params: { logs: 'off' },
	headers: {
		accept: 'application/json',
		'content-type': 'application/json',
		Authorization: 'VF.DM.672888605b0ae022eae391fa.o3AsgDpSmjBTvMiV',
	},
});

export default function ChatPage() {
	const chatId = useRef(new Date().getTime().toString());

	const [messages, setMessages] = useState<any[]>([]);

	const [message, setMessage] = useState('');

	const [loading, setLoading] = useState(false);

	async function getRuntime() {
		setLoading(true);
		const res = await api.post(`/state/user/${chatId.current}/interact`, {
			action: {
				type: 'launch',
			},
			state: {
				api_token: 'Basic U2Nob29sOiRjaG9vIQ==',
			},
			config: {
				tts: false,
				stripSSML: true,
				stopAll: true,
				excludeTypes: ['block', 'debug', 'flow'],
			},
		});
		setMessages((prev) => [...prev, ...res.data]);
		setLoading(false);
	}

	useEffect(() => {
		getRuntime();
	}, []);

	async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setMessages((prev) => [
			...prev,
			{
				message,
				date: new Date().toLocaleString(),
			},
		]);
		setMessage('');
		const res = await api.post(`/state/user/${chatId.current}/interact`, {
			action: {
				type: 'text',
				payload: message,
			},
			config: {
				tts: false,
				stripSSML: true,
				stopAll: true,
				excludeTypes: ['block', 'debug', 'flow'],
			},
		});
		setMessages((prev) => [...prev, ...res.data]);
		setLoading(false);
	}

	const viewMessages = messages.filter((message) => message.message || message.type === 'text');
	return (
		<div className="container mx-auto p-4 space-y-4">
			{viewMessages.length ? (
				viewMessages.map((message, index) => (
					<div key={index} className={clsx('p-3 flex items-end')}>
						{message.message ? (
							<>
								<div className="text-xs text-neutral-600 whitespace-nowrap">
									{message.date}
								</div>
								<div className="ml-auto pl-4">{message.message}</div>
							</>
						) : (
							<>
								{message.payload.message}
								<div className="ml-auto pl-4 text-xs text-neutral-600 whitespace-nowrap">
									{new Date(message.time).toLocaleString()}
								</div>
							</>
						)}
					</div>
				))
			) : (
				<div className="loading loading-spinner"></div>
			)}
			<form className="flex space-x-4" onSubmit={sendMessage}>
				<input
					type="text"
					placeholder="Type here"
					className="input input-bordered w-full max-w-xs"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					disabled={loading}
				/>
				<button className="btn btn-primary" type="submit" disabled={loading}>
					Submit
					{loading && <span className="loading loading-spinner"></span>}
				</button>
			</form>
		</div>
	);
}
