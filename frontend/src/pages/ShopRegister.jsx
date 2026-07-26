import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, Phone, MapPin, FileText, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const ShopRegister = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [formData, setFormData] = useState({
        shopName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        description: '',
        virtualTourPath: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            if (imageFile) {
                data.append('image', imageFile);
            }

            const res = await api.post('/shops/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            loginUser(res.data, 'shop');
            navigate('/shop-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Nursery registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card card animate-fade-in" style={{ maxWidth: '540px' }}>
                <div className="auth-header">
                    <div className="auth-logo">
                        <Store size={32} color="#3A6B4E" />
                    </div>
                    <h2>Register Your Nursery</h2>
                    <p className="auth-subtitle">Join Virtual Greenhouse SaaS to showcase and sell plants online</p>
                </div>

                {error && (
                    <div className="auth-error-alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Nursery / Shop Name</label>
                        <div className="input-with-icon">
                            <Store size={18} className="input-icon" />
                            <input
                                type="text"
                                name="shopName"
                                required
                                value={formData.shopName}
                                onChange={handleChange}
                                placeholder="Green Thumb Nursery"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Business Email</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="nursery@example.com"
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
                        <label>Contact Phone</label>
                        <div className="input-with-icon">
                            <Phone size={18} className="input-icon" />
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 44 2434 4455"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Physical Address</label>
                        <div className="input-with-icon">
                            <MapPin size={18} className="input-icon" />
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="No 12, Venkatesa St, Mylapore, Chennai"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nursery Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell buyers about your rare plants and organic growing methods..."
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Nursery Storefront Banner Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="input-field"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? <div className="spinner-sm"></div> : <Store size={18} />}
                        {loading ? 'Registering Nursery...' : 'Complete Seller Registration'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already registered? <Link to="/login">Sign in here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ShopRegister;
