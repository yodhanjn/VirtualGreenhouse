import React, { useState, useEffect } from 'react';
import { Package, Store, Calendar, MapPin, CheckCircle, Truck, Clock, XCircle, AlertCircle, Ban } from 'lucide-react';
import api from '../services/api';
import './Orders.css';

const TRACKING_STEPS = [
    { key: 'Pending', label: 'Order Placed', desc: 'Order received by nursery' },
    { key: 'Confirmed', label: 'Order Confirmed', desc: 'Nursery preparing plants' },
    { key: 'Shipped', label: 'Shipped', desc: 'In transit to address' },
    { key: 'Delivered', label: 'Delivered', desc: 'Delivered to destination' }
];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/user');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to load user orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? Item stock will be returned to the nursery.')) {
            return;
        }

        try {
            setCancellingId(orderId);
            setActionMsg({ type: '', text: '' });
            const res = await api.put(`/orders/${orderId}/cancel`);
            setActionMsg({ type: 'success', text: res.data.message || 'Order cancelled successfully' });
            await fetchOrders();
            setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
        } catch (err) {
            setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to cancel order' });
            setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusStepIndex = (status) => {
        switch (status) {
            case 'Pending': return 0;
            case 'Confirmed': return 1;
            case 'Shipped': return 2;
            case 'Delivered': return 3;
            case 'Cancelled': return -1;
            default: return 0;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={16} color="#15803D" />;
            case 'Shipped': return <Truck size={16} color="#4338CA" />;
            case 'Confirmed': return <CheckCircle size={16} color="#1D4ED8" />;
            case 'Cancelled': return <XCircle size={16} color="#DC2626" />;
            default: return <Clock size={16} color="#D97706" />;
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Loading your orders & tracking status...</p>
            </div>
        );
    }

    return (
        <div className="orders-page-wrapper container">
            <div className="page-header">
                <h1>My Plant Orders & Tracking</h1>
                <p className="page-subtitle">Track real-time shipment status and manage your plant purchases</p>
            </div>

            {actionMsg.text && (
                <div className={`action-alert-box ${actionMsg.type === 'error' ? 'error' : 'success'} animate-fade-in`}>
                    {actionMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    <span>{actionMsg.text}</span>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="card empty-orders-card animate-fade-in">
                    <Package size={48} color="#8DAA91" />
                    <h2>No Orders Found</h2>
                    <p>You haven't placed any plant orders yet.</p>
                </div>
            ) : (
                <div className="orders-stack">
                    {orders.map((order) => {
                        const currentStepIdx = getStatusStepIndex(order.status);
                        const isCancelled = order.status === 'Cancelled';
                        const canCancel = order.status === 'Pending' || order.status === 'Confirmed';

                        return (
                            <div key={order._id} className="card order-card animate-fade-in">
                                {/* Header */}
                                <div className="order-card-header">
                                    <div className="order-meta-group">
                                        <span className="order-id-badge">Order #{order._id.substring(order._id.length - 8)}</span>
                                        <div className="order-date flex-align">
                                            <Calendar size={14} color="#64748B" />
                                            <span>{new Date(order.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    <div className={`status-pill status-${order.status.toLowerCase()}`}>
                                        {getStatusIcon(order.status)}
                                        <span>{order.status}</span>
                                    </div>
                                </div>

                                <div className="order-seller-info">
                                    <Store size={16} color="#3A6B4E" />
                                    <span>Fulfilled by: <strong>{order.shop?.shopName || 'Partner Nursery'}</strong></span>
                                </div>

                                {/* Order Visual Tracker Stepper */}
                                <div className="order-tracking-container">
                                    <h4 className="tracking-title">Shipment Progress & Tracking</h4>

                                    {isCancelled ? (
                                        <div className="order-cancelled-banner">
                                            <Ban size={18} color="#DC2626" />
                                            <span>This order was cancelled. Stock has been returned to the seller.</span>
                                        </div>
                                    ) : (
                                        <div className="tracking-stepper">
                                            {TRACKING_STEPS.map((step, idx) => {
                                                const isCompleted = currentStepIdx > idx;
                                                const isCurrent = currentStepIdx === idx;
                                                return (
                                                    <div
                                                        key={step.key}
                                                        className={`stepper-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                                    >
                                                        <div className="stepper-circle">
                                                            {isCompleted ? (
                                                                <CheckCircle size={14} />
                                                            ) : (
                                                                <span>{idx + 1}</span>
                                                            )}
                                                        </div>
                                                        <div className="stepper-labels">
                                                            <span className="step-name">{step.label}</span>
                                                            <span className="step-desc">{step.desc}</span>
                                                        </div>

                                                        {idx < TRACKING_STEPS.length - 1 && (
                                                            <div className={`stepper-line ${currentStepIdx > idx ? 'active' : ''}`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Items Summary */}
                                <div className="order-items-grid">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <div className="item-name-qty">
                                                <span className="bullet-dot">•</span>
                                                <span>{item.plantName}</span>
                                                <span className="item-qty">x{item.quantity}</span>
                                            </div>
                                            <span className="item-subtotal-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer & Actions */}
                                <div className="order-card-footer">
                                    <div className="shipping-address-snippet">
                                        <MapPin size={14} color="#64748B" />
                                        <span>{order.shippingAddress}</span>
                                    </div>

                                    <div className="order-footer-right">
                                        <div className="order-total-price-box">
                                            <span>Total Paid:</span>
                                            <span className="total-price-amount">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                        </div>

                                        {/* Cancellation Action Button */}
                                        {!isCancelled && (
                                            canCancel ? (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    disabled={cancellingId === order._id}
                                                >
                                                    {cancellingId === order._id ? (
                                                        <div className="spinner-sm"></div>
                                                    ) : (
                                                        <XCircle size={16} />
                                                    )}
                                                    {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                                                </button>
                                            ) : (
                                                <div className="cancellation-disabled-tag" title="Orders cannot be cancelled once shipped or delivered">
                                                    <span>Order Shipped (Cannot Cancel)</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
