import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, User, Store, LogOut, Package, Compass, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, userType, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="navbar-header">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <Leaf size={22} color="#3A6B4E" />
                    </div>
                    <span className="brand-title">Virtual<span className="brand-accent">Greenhouse</span></span>
                </Link>

                <nav className={`navbar-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                    {userType === 'user' && (
                        <>
                            <Link to="/user-dashboard" className={`nav-link ${isActive('/user-dashboard') || isActive('/') ? 'active' : ''}`}>
                                <Compass size={18} />
                                Catalog
                            </Link>
                            <Link to="/shops" className={`nav-link ${isActive('/shops') ? 'active' : ''}`}>
                                <Store size={18} />
                                Nurseries
                            </Link>
                            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                                <Package size={18} />
                                My Orders
                            </Link>
                        </>
                    )}

                    {userType === 'shop' && (
                        <>
                            <Link to="/shop-dashboard" className={`nav-link ${isActive('/shop-dashboard') ? 'active' : ''}`}>
                                <Store size={18} />
                                Seller Dashboard
                            </Link>
                        </>
                    )}

                    {!user && (
                        <div className="nav-auth-buttons">
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register/user" className="btn btn-primary">Join as Buyer</Link>
                            <Link to="/register/shop" className="btn btn-secondary">Sell Plants</Link>
                        </div>
                    )}
                </nav>

                <div className="navbar-actions">
                    {userType === 'user' && (
                        <Link to="/cart" className="cart-button" title="View Cart">
                            <ShoppingCart size={22} color="#3A6B4E" />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    )}

                    {user && (
                        <div className="user-profile-menu">
                            <Link to="/profile" className="profile-btn" title="Profile">
                                <User size={20} />
                                <span className="user-name-display">{user.name || user.shopName}</span>
                            </Link>
                            <button onClick={handleLogout} className="logout-icon-btn" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}

                    <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
