import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute: React.FC = () => {
    const { user, isAuthenticated } = useAuth();

    // Si l'utilisateur n'est pas connecté, ou s'il est connecté mais n'est pas ADMIN
    if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
        // Rediriger vers l'accueil (ou login)
        return <Navigate to="/" replace />;
    }

    // Si tout est bon, afficher la route enfant
    return <Outlet />;
};

export default AdminRoute;
