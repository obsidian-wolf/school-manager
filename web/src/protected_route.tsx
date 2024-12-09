import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, useLogout } from './auth_store';
import clsx from 'clsx';

interface ProtectedRouteProps {
    children: JSX.Element;
    isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAdmin }) => {
    const { auth } = useAuthStore();

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    if (isAdmin && !auth.pam_token) {
        return <Navigate to="/chat" replace />;
    }

    return auth ? <ProtectedLayout>{children}</ProtectedLayout> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

function ProtectedLayout({ children }: { children: JSX.Element }) {
    const logout = useLogout();
    const location = useLocation();

    return (
        <div className="flex h-screen w-screen">
            <nav className="h-full shadow bg-stone-100">
                <div className="p-4 text-xl">School Manager</div>
                <ul className="menu w-56 space-y-2">
                    <li>
                        <Link className={clsx({ active: location.pathname === '/' })} to="/">
                            Files
                        </Link>
                    </li>
                    <li>
                        <Link className={clsx({ active: location.pathname !== '/' })} to="/parents">
                            Parents
                        </Link>
                    </li>
                    <li>
                        <Link to="/chat">Go to chat</Link>
                    </li>
                    <li>
                        <a onClick={() => logout()}>Logout</a>
                    </li>
                </ul>
            </nav>
            <main className="flex-1 p-4 min-w-0 overflow-auto">{children}</main>
        </div>
    );
}
