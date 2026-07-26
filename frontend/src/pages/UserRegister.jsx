import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const UserRegister = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
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
            const res = await api.post('/users/register', formData);
            loginUser(res.data, 'user');
            navigate('/user-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your information.');
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
                    <h2>Create Buyer Account</h2>
                    <p className="auth-subtitle">Join Virtual Greenhouse to buy 3D plants & tour nurseries</p>
                </div>

                {error && (
                    <div className="auth-error-alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                className="input-field"
                            />
                        </div>
                    </div>

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
                                placeholder="jane@example.com"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password (min 6 chars)</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <div className="input-with-icon">
                            <Phone size={18} className="input-icon" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Shipping Address</label>
                        <div className="input-with-icon">
                            <MapPin size={18} className="input-icon" />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="42 Blossom Ave, Chennai"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? <div className="spinner-sm"></div> : <UserPlus size={18} />}
                        {loading ? 'Creating account...' : 'Complete Buyer Registration'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in here</Link></p>
                    <p style={{ marginTop: '8px', fontSize: '0.82rem' }}>
                        Are you a nursery seller? <Link to="/register/shop">Register Nursery</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
