import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container footer-container">
                <div className="footer-brand-col">
                    <div className="footer-logo">
                        <Leaf size={24} color="#3A6B4E" />
                        <span>VirtualGreenhouse</span>
                    </div>
                    <p className="footer-tagline">
                        Next-generation SaaS marketplace empowering nurseries and plant lovers with 3D models and virtual nursery tours.
                    </p>
                </div>

                <div className="footer-links-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/user-dashboard">Explore Plants</Link></li>
                        <li><Link to="/shops">Nursery Directory</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/orders">Order Tracking</Link></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h4>SaaS Sellers</h4>
                    <ul>
                        <li><Link to="/register/shop">Register Nursery</Link></li>
                        <li><Link to="/login">Seller Sign In</Link></li>
                        <li><Link to="/shop-dashboard">Inventory Panel</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-content">
                    <p>&copy; {new Date().getFullYear()} Virtual Greenhouse SaaS Platform. Crafted with soft organic aesthetics.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
