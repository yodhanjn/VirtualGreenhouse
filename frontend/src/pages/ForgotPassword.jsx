import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import './AuthPages.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await api.post('/users/forgot-password', { email });
            setMessage(res.data.message);
            if (res.data.resetToken) {
                setResetToken(res.data.resetToken);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request password reset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card card animate-fade-in">
                <div className="auth-header">
                    <h2>Reset Password</h2>
                    <p className="auth-subtitle">Enter your email address to receive password recovery instructions</p>
                </div>

                {error && (
                    <div className="auth-error-alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {message ? (
                    <div className="success-box" style={{ textAlign: 'center', padding: '20px 0' }}>
                        <CheckCircle size={48} color="#4E8765" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ color: '#3A6B4E', marginBottom: '8px' }}>Reset Initiated</h3>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>{message}</p>
                        {resetToken && (
                            <Link to={`/reset-password?token=${resetToken}`} className="btn btn-primary">
                                Proceed to Enter New Password
                            </Link>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Account Email</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                            {loading ? <div className="spinner-sm"></div> : <Mail size={18} />}
                            {loading ? 'Sending Request...' : 'Send Recovery Token'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
