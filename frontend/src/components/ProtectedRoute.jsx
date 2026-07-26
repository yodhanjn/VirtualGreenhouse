import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
    const { token, userType: storedUserType, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Verifying access...</p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (userType && storedUserType !== userType) {
        const fallbackRoute = storedUserType === 'shop' ? '/shop-dashboard' : '/user-dashboard';
        return <Navigate to={fallbackRoute} replace />;
    }

    return children;
};

export default ProtectedRoute;
