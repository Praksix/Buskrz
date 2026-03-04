import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    // Rediriger vers la page de login
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, afficher la route enfant
  return <Outlet />;
};

export default ProtectedRoute;