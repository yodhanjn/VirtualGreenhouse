import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, Phone, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import VirtualTourModal from '../components/VirtualTourModal';
import './ShopsList.css';

const ShopsList = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTour, setActiveTour] = useState(null);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await api.get('/shops');
                setShops(res.data);
            } catch (err) {
                console.error('Failed to load nurseries list:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    return (
        <div className="shops-list-wrapper container">
            <div className="page-header">
                <div>
                    <h1>Verified Partner Nurseries</h1>
                    <p className="page-subtitle">Discover local plant sellers, view their inventory, and take 360° virtual tours</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner-container">
                    <div className="spinner"></div>
                    <p>Loading nurseries...</p>
                </div>
            ) : (
                <div className="shops-grid">
                    {shops.map((shop) => (
                        <div key={shop._id} className="card shop-card animate-fade-in">
                            <div className="shop-card-image-wrapper">
                                <img
                                    src={shop.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                                    alt={shop.shopName}
                                    className="shop-card-img"
                                />
                                {shop.isVerified && (
                                    <span className="badge badge-success shop-verified-badge">
                                        <CheckCircle2 size={12} /> Verified Seller
                                    </span>
                                )}
                            </div>

                            <div className="shop-card-body">
                                <h3>{shop.shopName}</h3>
                                <p className="shop-desc">{shop.description}</p>

                                <div className="shop-details-meta">
                                    <div className="meta-item">
                                        <MapPin size={16} color="#3A6B4E" />
                                        <span>{shop.address}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Phone size={16} color="#3A6B4E" />
                                        <span>{shop.phone}</span>
                                    </div>
                                </div>

                                <div className="shop-card-actions">
                                    {shop.virtualTourPath && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setActiveTour({ shopName: shop.shopName, tourPath: shop.virtualTourPath })}
                                        >
                                            <Compass size={16} /> 360° Virtual Tour
                                        </button>
                                    )}

                                    <Link to={`/nursery/${shop._id}`} className="btn btn-primary btn-sm">
                                        Visit Storefront <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTour && (
                <VirtualTourModal
                    shopName={activeTour.shopName}
                    tourPath={activeTour.tourPath}
                    onClose={() => setActiveTour(null)}
                />
            )}
        </div>
    );
};

export default ShopsList;
