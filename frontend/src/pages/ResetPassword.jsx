import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import './AuthPages.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        setLoading(true);
        try {
            await api.post('/users/reset-password', { token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card card animate-fade-in">
                <div className="auth-header">
                    <h2>Set New Password</h2>
                    <p className="auth-subtitle">Create a secure new password for your account</p>
                </div>

                {error && (
                    <div className="auth-error-alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {success ? (
                    <div className="success-box" style={{ textAlign: 'center', padding: '20px 0' }}>
                        <CheckCircle size={48} color="#4E8765" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ color: '#3A6B4E' }}>Password Updated!</h3>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '8px' }}>
                            Redirecting to login page...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                            {loading ? <div className="spinner-sm"></div> : <Lock size={18} />}
                            {loading ? 'Updating Password...' : 'Save New Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
