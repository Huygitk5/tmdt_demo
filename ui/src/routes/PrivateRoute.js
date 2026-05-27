// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useSelector(state => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        // Nếu cố vào trang không đúng quyền, đẩy về trang chủ của role đó
        return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
    }

    return children;
};

export default PrivateRoute;