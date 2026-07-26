import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogIn, Store, User, Lock, Mail, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [loginRole, setLoginRole] = useState('user'); // 'user' or 'shop'
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = loginRole === 'shop' ? '/shops/login' : '/users/login';
            const res = await api.post(endpoint, formData);
            loginUser(res.data, loginRole);
            navigate(loginRole === 'shop' ? '/shop-dashboard' : '/user-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Leaf size={32} color="#3A6B4E" />
                    </div>
                    <h2>Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to your Virtual Greenhouse account</p>

                    <div className="role-selector">
                        <button
                            className={`role-tab ${loginRole === 'user' ? 'active' : ''}`}
                            onClick={() => setLoginRole('user')}
                        >
                            <User size={16} /> Buyer Account
                        </button>
                        <button
                            className={`role-tab ${loginRole === 'shop' ? 'active' : ''}`}
                            onClick={() => setLoginRole('shop')}
                        >
                            <Store size={16} /> Seller / Nursery
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="auth-error-alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={loginRole === 'user' ? 'user@example.com' : 'nandanam@example.com'}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="label-with-link">
                            <label>Password</label>
                            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                        </div>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? <div className="spinner-sm"></div> : <LogIn size={18} />}
                        {loading ? 'Signing in...' : `Sign in as ${loginRole === 'user' ? 'Buyer' : 'Nursery'}`}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        {loginRole === 'user' ? (
                            <Link to="/register/user">Register as Buyer</Link>
                        ) : (
                            <Link to="/register/shop">Register Nursery</Link>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
