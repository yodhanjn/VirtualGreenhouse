import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy load pages for optimal initial load time
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ShopDashboard = lazy(() => import('./pages/ShopDashboard'));
const ShopsList = lazy(() => import('./pages/ShopsList'));
const NurseryDetails = lazy(() => import('./pages/NurseryDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const UserRegister = lazy(() => import('./pages/UserRegister'));
const ShopRegister = lazy(() => import('./pages/ShopRegister'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingSpinner = () => (
    <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p>Loading Virtual Greenhouse...</p>
    </div>
);

const AppLayout = ({ children }) => (
    <div className="app-layout">
        <Navbar />
        <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
                {children}
            </Suspense>
        </main>
        <Footer />
    </div>
);

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <AppLayout>
                        <Routes>
                            {/* Public Auth Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register/user" element={<UserRegister />} />
                            <Route path="/register/shop" element={<ShopRegister />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />

                            {/* Buyer Routes */}
                            <Route path="/" element={<UserDashboard />} />
                            <Route path="/user-dashboard" element={<UserDashboard />} />
                            <Route path="/shops" element={<ShopsList />} />
                            <Route path="/nursery/:id" element={<NurseryDetails />} />

                            <Route path="/cart" element={
                                <ProtectedRoute userType="user">
                                    <Cart />
                                </ProtectedRoute>
                            } />
                            <Route path="/checkout" element={
                                <ProtectedRoute userType="user">
                                    <Checkout />
                                </ProtectedRoute>
                            } />
                            <Route path="/orders" element={
                                <ProtectedRoute userType="user">
                                    <Orders />
                                </ProtectedRoute>
                            } />

                            {/* Seller Routes */}
                            <Route path="/shop-dashboard" element={
                                <ProtectedRoute userType="shop">
                                    <ShopDashboard />
                                </ProtectedRoute>
                            } />

                            {/* Profile Route */}
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AppLayout>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
