import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, Phone, Mail, Compass, ArrowLeft, Leaf } from 'lucide-react';
import api from '../services/api';
import PlantCard from '../components/PlantCard';
import VirtualTourModal from '../components/VirtualTourModal';
import './NurseryDetails.css';

const NurseryDetails = () => {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const res = await api.get(`/shops/${id}`);
                setShop(res.data.shop);
                setPlants(res.data.plants);
            } catch (err) {
                console.error('Failed to load nursery details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Loading nursery storefront...</p>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="container" style={{ padding: '60px 0', textCenter: 'center' }}>
                <h2>Nursery Not Found</h2>
                <Link to="/shops" className="btn btn-primary" style={{ marginTop: '16px' }}>Return to Nursery Directory</Link>
            </div>
        );
    }

    return (
        <div className="nursery-details-wrapper container">
            <Link to="/shops" className="back-link">
                <ArrowLeft size={16} /> Back to Nursery Directory
            </Link>

            <div className="nursery-header-banner card animate-fade-in">
                <div className="nursery-banner-image-box">
                    <img
                        src={shop.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                        alt={shop.shopName}
                        className="nursery-banner-img"
                    />
                </div>

                <div className="nursery-header-info">
                    <div className="nursery-title-row">
                        <h1>{shop.shopName}</h1>
                        {shop.virtualTourPath && (
                            <button className="btn btn-secondary" onClick={() => setShowTour(true)}>
                                <Compass size={18} /> Launch 360° Virtual Nursery Tour
                            </button>
                        )}
                    </div>

                    <p className="nursery-full-desc">{shop.description}</p>

                    <div className="nursery-contacts-grid">
                        <div className="contact-chip">
                            <MapPin size={16} color="#3A6B4E" />
                            <span>{shop.address}</span>
                        </div>
                        <div className="contact-chip">
                            <Phone size={16} color="#3A6B4E" />
                            <span>{shop.phone}</span>
                        </div>
                        <div className="contact-chip">
                            <Mail size={16} color="#3A6B4E" />
                            <span>{shop.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="nursery-catalog-section">
                <div className="section-title-group">
                    <h2>Plants Available at {shop.shopName}</h2>
                    <span className="count-pill">{plants.length} Listings</span>
                </div>

                {plants.length === 0 ? (
                    <div className="empty-catalog card">
                        <Leaf size={48} color="#8DAA91" />
                        <h4>No Plant Listings Yet</h4>
                        <p>This nursery has not published any active listings in their catalog.</p>
                    </div>
                ) : (
                    <div className="plant-grid">
                        {plants.map((plant) => (
                            <PlantCard key={plant._id} plant={plant} />
                        ))}
                    </div>
                )}
            </section>

            {showTour && (
                <VirtualTourModal
                    shopName={shop.shopName}
                    tourPath={shop.virtualTourPath}
                    onClose={() => setShowTour(false)}
                />
            )}
        </div>
    );
};

export default NurseryDetails;
