// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Layouts & PrivateRoute
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './routes/PrivateRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Public Pages (Storefront)
import PlatformPage from './pages/public/PlatformPage';

// Customer Pages
import DashboardPage from './pages/customer/DashboardPage';
import ProductListPage from './pages/customer/ProductListPage';
import CreateProductPage from './pages/customer/CreateProductPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import EditProductPage from './pages/customer/EditProductPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPendingProducts from './pages/admin/AdminPendingProducts';
import AdminProductDetailPage from './pages/admin/AdminProductDetailPage';
import AdminApprovedProducts from './pages/admin/AdminApprovedProducts';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* ----- ĐIỀU HƯỚNG MẶC ĐỊNH ----- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* ----- PUBLIC ROUTES ----- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/platforms/:id" element={<PlatformPage />} /> {/* Trang Sàn cho Khách */}
          
          {/* ----- CUSTOMER ROUTES ----- */}
          <Route path="/customer" element={
            <PrivateRoute requiredRole="CUSTOMER">
              <CustomerLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
          </Route>

          {/* ----- ADMIN ROUTES ----- */}
          <Route path="/admin" element={
              <PrivateRoute requiredRole="ADMIN">
                  <AdminLayout />
              </PrivateRoute>
          }>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products/pending" element={<AdminPendingProducts />} />
              <Route path="products/:id" element={<AdminProductDetailPage />} />
              <Route path="products/approved" element={<AdminApprovedProducts />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;