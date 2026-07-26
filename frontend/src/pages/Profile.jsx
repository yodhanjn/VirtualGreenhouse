import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './AuthPages.css';

const Profile = () => {
    const { user, userType, setUser } = useAuth();
    const [name, setName] = useState(user?.name || user?.shopName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            const endpoint = userType === 'shop' ? '/shops/profile/me' : '/users/profile';
            const payload = userType === 'shop'
                ? { shopName: name, phone, address }
                : { name, phone, address };

            const res = await api.put(endpoint, payload);
            setUser(res.data.user || res.data.shop);
            setSuccessMsg('Profile details updated successfully');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '640px' }}>
            <div className="card animate-fade-in" style={{ padding: '36px' }}>
                <div className="auth-header">
                    <div className="auth-logo">
                        <User size={32} color="#3A6B4E" />
                    </div>
                    <h2>Account Profile Settings</h2>
                    <p className="auth-subtitle">Manage your personal information and delivery preferences</p>
                </div>

                {successMsg && (
                    <div className="badge badge-success" style={{ padding: '12px 16px', fontSize: '0.9rem', marginBottom: '20px', width: '100%', justifyContent: 'center' }}>
                        <Check size={16} /> {successMsg}
                    </div>
                )}

                {errorMsg && (
                    <div className="auth-error-alert">
                        <AlertCircle size={16} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>{userType === 'shop' ? 'Shop / Nursery Name' : 'Full Name'}</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address (Immutable)</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                disabled
                                value={user?.email || ''}
                                className="input-field"
                                style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <div className="input-with-icon">
                            <Phone size={18} className="input-icon" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Default Shipping Address</label>
                        <div className="input-with-icon">
                            <MapPin size={18} className="input-icon" />
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? <div className="spinner-sm"></div> : <Check size={18} />}
                        {loading ? 'Saving Changes...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
