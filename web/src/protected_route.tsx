import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from './auth_store';

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
        return <Navigate to="/" replace />;
    }

    return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
