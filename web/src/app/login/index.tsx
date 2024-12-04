import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '~/api/endpoints';
import { useAuthStore } from '~/auth_store';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const authStore = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await login.mutateAsync({
                data: {
                    email,
                    password,
                },
            });

            authStore.setAuth(res);

            navigate('/');
        } catch {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="h-screen bg-stone-100 flex items-center justify-center">
            <div className="px-4 max-w-full w-80">
                <h1 className="py-4">
                    Login to <strong>School Manager</strong>
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="input input-bordered flex items-center gap-2">
                        <AtSymbolIcon className="h-4 text-neutral-600" />
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <KeyIcon className="h-4 text-neutral-600" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-outline w-full"
                            disabled={login.isPending}
                        >
                            {login.isPending ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
