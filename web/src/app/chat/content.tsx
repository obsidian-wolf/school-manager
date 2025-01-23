'use client';
import { useEffect, useRef, useState } from 'react';
import { GetChat200 } from '~/api/model';
import { Bars4Icon } from '@heroicons/react/24/solid';
import { useLogout } from '~/auth_store';
import { getChat } from '~/api/endpoints';

export function ChatPageContent() {
    const [chat, setChat] = useState<GetChat200 | undefined>(undefined);
    const logout = useLogout();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getOrResetChat();
    }, []);

    async function getOrResetChat(forceReset = false) {
        setChat(undefined);
        setChat(await getChat({ forceReset }));
    }

    useEffect(() => {
        // check if element with id voiceflow-chat exists on document
        if (document.getElementById('voiceflow-chat') || !chat?.chat.id) {
            return;
        }
        const v = document.createElement('script');
        v.id = 'voiceflow-chat';
        const s = document.getElementsByTagName('script')[0];
        console.log(chat);
        v.onload = function () {
            (window as any).voiceflow.chat.load({
                verify: { projectID: '670001dd8b43f585790e46b3' },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production',
                userID: chat.chat.id,
                launch: {
                    event: {
                        type: 'launch',
                        payload: chat.startupVariables,
                    },
                },
                render: {
                    mode: 'embedded',
                    target: ref.current!,
                },
            });
            console.log((window as any).voiceflow.chat);
        };
        v.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
        v.type = 'text/javascript';
        s.parentNode?.insertBefore(v, s);
    }, [chat]);

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
                    <li>
                        <a onClick={() => logout()}>Logout</a>
                    </li>
                </ul>
            </div>
            <div id="chat" ref={ref} className="md:p-20 h-full"></div>
        </div>
    );
}
