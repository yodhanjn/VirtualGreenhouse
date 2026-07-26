import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Box, Store, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Plant3DViewer from './Plant3DViewer';
import './PlantCard.css';

const PlantCard = ({ plant }) => {
    const { addToCart } = useCart();
    const { userType } = useAuth();
    const [show3dModal, setShow3dModal] = useState(false);
    const [adding, setAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (userType === 'shop') {
            setErrorMsg('Seller accounts cannot buy plants');
            setTimeout(() => setErrorMsg(''), 3000);
            return;
        }

        try {
            setAdding(true);
            await addToCart(plant._id, 1);
            setAddedSuccess(true);
            setTimeout(() => setAddedSuccess(false), 2500);
        } catch (err) {
            setErrorMsg(err.message || 'Error adding to cart');
            setTimeout(() => setErrorMsg(''), 3000);
        } finally {
            setAdding(false);
        }
    };

    const has3dModel = Boolean(plant.model3dGlb || plant.model3dHtml);

    return (
        <>
            <div className="card plant-card animate-fade-in">
                <div className="plant-image-container">
                    <img
                        src={plant.image.startsWith('http') ? plant.image : plant.image}
                        alt={plant.name}
                        className="plant-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=800&q=80';
                        }}
                    />
                    <div className="plant-badges">
                        <span className="badge badge-sage">{plant.category}</span>
                        {has3dModel && (
                            <span className="badge badge-3d">
                                <Box size={12} /> 3D Viewable
                            </span>
                        )}
                    </div>
                </div>

                <div className="plant-card-content">
                    <div className="plant-shop-link">
                        <Store size={14} color="#64748B" />
                        <Link to={`/nursery/${plant.shop?._id || plant.shop}`}>
                            {plant.shop?.shopName || 'Partner Nursery'}
                        </Link>
                    </div>

                    <h3 className="plant-title">{plant.name}</h3>
                    <p className="plant-description">{plant.description}</p>

                    <div className="plant-card-footer">
                        <div className="plant-price-group">
                            <span className="price-currency">₹</span>
                            <span className="price-value">{plant.price.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="plant-card-actions">
                            {has3dModel && (
                                <button
                                    className="btn btn-outline btn-icon"
                                    title="Explore 3D Plant Model"
                                    onClick={() => setShow3dModal(true)}
                                >
                                    <Box size={18} color="#3A6B4E" />
                                </button>
                            )}

                            <button
                                className={`btn ${addedSuccess ? 'btn-success' : 'btn-primary'}`}
                                onClick={handleAddToCart}
                                disabled={adding || !plant.inStock}
                            >
                                {addedSuccess ? (
                                    <>
                                        <Check size={16} /> Added
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={16} /> Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="plant-card-error">
                            <AlertCircle size={14} />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                </div>
            </div>

            {show3dModal && (
                <Plant3DViewer
                    plantName={plant.name}
                    model3dGlb={plant.model3dGlb}
                    model3dHtml={plant.model3dHtml}
                    onClose={() => setShow3dModal(false)}
                />
            )}
        </>
    );
};

export default PlantCard;
