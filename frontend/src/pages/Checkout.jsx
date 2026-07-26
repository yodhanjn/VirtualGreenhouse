import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const { cart, fetchCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState(user?.address || '');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successOrders, setSuccessOrders] = useState(null);

    const items = cart?.items || [];
    const subtotal = cart?.totalAmount || 0;
    const shipping = 99;
    const grandTotal = subtotal + shipping;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!shippingAddress.trim()) {
            return setError('Please enter a valid shipping address');
        }

        setError('');
        setLoading(true);

        try {
            const res = await api.post('/orders/checkout', {
                shippingAddress,
                paymentMethod
            });

            setSuccessOrders(res.data.orders);
            await fetchCart();
            setTimeout(() => {
                navigate('/orders');
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (successOrders) {
        return (
            <div className="container" style={{ padding: '80px 20px', maxWidth: '600px' }}>
                <div className="card checkout-success-card animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
                    <CheckCircle2 size={64} color="#4E8765" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ color: '#3A6B4E', marginBottom: '8px' }}>Order Placed Successfully!</h2>
                    <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '24px' }}>
                        Your plant order has been partitioned & routed to partner nurseries. Redirecting to your orders dashboard...
                    </p>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-wrapper container">
            <div className="page-header">
                <h1>Complete Your Order</h1>
                <p className="page-subtitle">Finalize delivery details and select payment method</p>
            </div>

            {error && (
                <div className="auth-error-alert" style={{ marginBottom: '24px' }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handlePlaceOrder} className="checkout-grid-layout">
                <div className="checkout-form-column">
                    {/* Shipping Address */}
                    <div className="card checkout-section-card animate-fade-in">
                        <div className="section-card-header">
                            <MapPin size={22} color="#3A6B4E" />
                            <h3>Shipping Address</h3>
                        </div>

                        <div className="form-group">
                            <label>Delivery Address</label>
                            <textarea
                                rows={3}
                                required
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Enter street address, landmark, city, postal code..."
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="card checkout-section-card animate-fade-in">
                        <div className="section-card-header">
                            <CreditCard size={22} color="#3A6B4E" />
                            <h3>Payment Method</h3>
                        </div>

                        <div className="payment-options-grid">
                            {['Cash on Delivery', 'Credit Card', 'Debit Card', 'PayPal'].map((method) => (
                                <label key={method} className={`payment-option-card ${paymentMethod === method ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={() => setPaymentMethod(method)}
                                    />
                                    <span>{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkout Summary Column */}
                <div className="checkout-summary-column">
                    <div className="card summary-card">
                        <h3>Order Summary ({items.length} Items)</h3>

                        <div className="checkout-items-preview">
                            {items.map((item, idx) => (
                                <div key={idx} className="preview-item-row">
                                    <span>{item.plant?.name} x {item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="summary-row">
                            <span>Eco Shipping</span>
                            <span>₹{shipping.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total-row">
                            <span>Grand Total</span>
                            <span className="grand-total">₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>

                        <button type="submit" className="btn btn-primary checkout-btn" disabled={loading}>
                            {loading ? <div className="spinner-sm"></div> : <ShieldCheck size={18} />}
                            {loading ? 'Processing Order...' : 'Confirm & Place Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
