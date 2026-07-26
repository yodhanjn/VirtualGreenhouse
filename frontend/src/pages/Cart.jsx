import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, Leaf } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
    const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const items = cart?.items || [];
    const subtotal = cart?.totalAmount || 0;
    const shipping = items.length > 0 ? 99 : 0;
    const grandTotal = subtotal + shipping;

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Fetching cart items...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="cart-empty-wrapper container">
                <div className="card cart-empty-card animate-fade-in">
                    <div className="empty-cart-icon">
                        <ShoppingBag size={48} color="#3A6B4E" />
                    </div>
                    <h2>Your Shopping Cart is Empty</h2>
                    <p>Explore our catalog of 3D-viewable plants and bring lush greenery to your home.</p>
                    <Link to="/user-dashboard" className="btn btn-primary">
                        Browse Plant Catalog <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper container">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <button className="btn btn-outline btn-sm" onClick={clearCart}>
                    <Trash2 size={14} /> Clear Cart
                </button>
            </div>

            <div className="cart-grid-layout">
                {/* Cart Items List */}
                <div className="cart-items-column">
                    {items.map((item) => {
                        const plant = item.plant;
                        if (!plant) return null;
                        return (
                            <div key={plant._id} className="card cart-item-card animate-fade-in">
                                <img
                                    src={plant.image}
                                    alt={plant.name}
                                    className="cart-item-img"
                                />

                                <div className="cart-item-details">
                                    <div className="cart-item-shop">
                                        <Store size={14} color="#64748B" />
                                        <span>{plant.shop?.shopName || 'Partner Nursery'}</span>
                                    </div>
                                    <h3 className="cart-item-title">{plant.name}</h3>
                                    <span className="cart-item-category badge badge-sage">{plant.category}</span>
                                </div>

                                <div className="cart-item-price-col">
                                    <span className="unit-price">₹{plant.price.toLocaleString('en-IN')}</span>

                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(plant._id, Math.max(1, item.quantity - 1))}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(plant._id, item.quantity + 1)}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-subtotal-col">
                                    <span className="item-subtotal">₹{(plant.price * item.quantity).toLocaleString('en-IN')}</span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(plant._id)}
                                        title="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Box */}
                <div className="cart-summary-column">
                    <div className="card summary-card">
                        <h3>Order Summary</h3>

                        <div className="summary-row">
                            <span>Plant Subtotal</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="summary-row">
                            <span>Estimated Eco Shipping</span>
                            <span>₹{shipping.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span className="grand-total">₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>

                        <button
                            className="btn btn-primary checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout <ArrowRight size={18} />
                        </button>

                        <p className="secure-text">🔒 Safe & Encrypted Eco Checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
