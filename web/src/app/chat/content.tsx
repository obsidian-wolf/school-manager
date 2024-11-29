'use client';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

const api = axios.create({
    baseURL: 'https://general-runtime.voiceflow.com',
    params: { logs: 'off' },
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'VF.DM.672888605b0ae022eae391fa.o3AsgDpSmjBTvMiV',
    },
});

/*
{
    "_id": "6749ea7dda309e1eb4f60984",
    "password": "password!",
    "contact_info": {
      "phone_number": "01231212333",
      "email": "cj@mail.com"
    },
    "surname": "Visser",
    "first_name": "CJ",
    "user_name": "string",
    "parent_id": "6724cd433072a8be299591d1",
    "is_admin": false,
    "created_at": "2024-11-29T16:23:25.392Z",
    "is_deleted": false,
    "type": "api"
  }*/

const SCHOOL_ID = '6724cd433072a8be299591d1';
const SCHOOL_PASSWORD = '$choo!';
const API_TOKEN = btoa(`${SCHOOL_ID}:${SCHOOL_PASSWORD}`);

export function ChatPageContent() {
    const chatId = useRef(new Date().getTime().toString());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                variables: {
                    api_token: `Basic ${API_TOKEN}`,
                    debug_ind: 1,
                    parent: {
                        id: '6749ea7dda309e1eb4f60984',
                        name: 'CJ Visser',
                        email: 'cj.visser@mail.com',
                        phone: '123-456-7890',
                    },
                    students: [
                        {
                            id: '10001',
                            name: 'John Smith',
                            gender: 'Male',
                            grade: '5',
                            date_of_birth: '2012-06-15',
                            teacher: {
                                id: '101',
                                name: 'Ms. Emily Johnson',
                            },
                        },
                        {
                            id: '10002',
                            name: 'Sophia Brown',
                            gender: 'Female',
                            grade: '3',
                            date_of_birth: '2014-09-23',
                            teacher: {
                                id: '102',
                                name: 'Mr. David Lee',
                            },
                        },
                        {
                            id: '10003',
                            name: 'Liam Martinez',
                            gender: 'Male',
                            grade: '2',
                            date_of_birth: '2015-03-10',
                            teacher: {
                                id: '103',
                                name: 'Ms. Sarah Taylor',
                            },
                        },
                    ],
                },
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
