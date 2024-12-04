'use client';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { getChat, useSendMessage } from '~/api/endpoints';
import { GetChat200 } from '~/api/model';
import { ActorTypes } from '~/pam_api/model';
import { Bars4Icon, ChevronRightIcon } from '@heroicons/react/24/solid';

export function ChatPageContent() {
    const [chat, setChat] = useState<GetChat200 | undefined>(undefined);

    const { mutateAsync: sendMessage, isPending: isMessagesLoading } = useSendMessage();

    useEffect(() => {
        getOrResetChat();
    }, []);

    async function getOrResetChat(forceReset = false) {
        setChat(undefined);
        setChat(await getChat({ forceReset }));
    }

    const [message, setMessage] = useState('');

    const isLoading = !chat || isMessagesLoading;

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!chat) return;

        setChat({
            ...chat,
            messages: [
                ...chat.messages,
                {
                    actor: ActorTypes.User,
                    created_at: new Date().toISOString(),
                    is_deleted: false,
                    parent_text: message,
                },
            ],
        });

        setMessage('');

        const r = await sendMessage({
            chatId: chat.id,
            data: {
                text: message,
            },
        });
        setChat(r);
    }

    const viewMessages = chat?.messages.filter(
        (message) =>
            message.parent_text || message.voiceflowResponses?.find((v) => v.type === 'text'),
    );

    return (
        <div className="h-screen bg-stone-100 relative">
            <div className="dropdown dropdown-end absolute top-0 right-0 m-2">
                <div tabIndex={0} role="button" className="btn btn-sm shadow">
                    <Bars4Icon className="h-5" />
                </div>
                <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                    <li onClick={() => getOrResetChat(true)}>
                        <a>Reset Chat</a>
                    </li>
                </ul>
            </div>
            <div className="container h-full mx-auto px-4 py-6 flex flex-col">
                <div className="flex-1 overflow-auto space-y-4">
                    {viewMessages?.length ? (
                        viewMessages.map((message, index) => (
                            <div key={index} className={clsx('flex flex-col')}>
                                {message.parent_text ? (
                                    <div className="rounded inline-flex flex-col py-1 px-2 shadow-lg bg-green-100 ml-auto">
                                        <div className="">{message.parent_text}</div>
                                        <div className="ml-auto text-[11px] text-neutral-700 whitespace-nowrap">
                                            {new Date(message.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {message.voiceflowResponses
                                            ?.filter((v) => v.type === 'text')
                                            .map((v, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded inline-flex flex-col mr-auto py-1 px-2 shadow-lg bg-white"
                                                >
                                                    <Markdown>{v.payload.message}</Markdown>
                                                    <div className="ml-auto pl-4 text-[11px] text-neutral-500 whitespace-nowrap">
                                                        {new Date(
                                                            message.created_at,
                                                        ).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="loading loading-spinner"></div>
                    )}
                </div>
                <form className="flex space-x-4 w-full pt-4" onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full flex-1 max-w-full"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                    />
                    <div className="flex gap-4">
                        <button
                            className="btn btn-success w-14"
                            type="submit"
                            disabled={isLoading || !message}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                <ChevronRightIcon className="h-6 text-white" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
