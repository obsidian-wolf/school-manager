import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Login200 } from './api/model';

interface AuthStoreState {
    auth?: Login200;
    setAuth: (auth?: Login200) => void;
}

const AUTH_LOCALSTORAGE_KEY = `school_manager`;

export const useAuthStore = create(
    persist<AuthStoreState>(
        (set) => ({
            auth: undefined,
            setAuth: (auth?: Login200) => {
                set(() => ({ auth }));
            },
        }),
        { name: AUTH_LOCALSTORAGE_KEY },
    ),
);
