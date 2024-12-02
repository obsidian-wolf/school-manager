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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
