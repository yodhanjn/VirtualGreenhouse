import React, { useState, useEffect } from 'react';
import { Search, Compass, Store, Sparkles, Filter, Leaf } from 'lucide-react';
import api from '../services/api';
import PlantCard from '../components/PlantCard';
import VirtualTourModal from '../components/VirtualTourModal';
import './UserDashboard.css';

const CATEGORIES = ['All', 'Indoor', 'Outdoor', 'Succulent', 'Herb', 'Flowering', 'Foliage', 'Indoor & Air-Purifying'];

const UserDashboard = () => {
    const [plants, setPlants] = useState([]);
    const [shops, setShops] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTour, setActiveTour] = useState(null); // { shopName, tourPath }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [plantsRes, shopsRes] = await Promise.all([
                    api.get('/plants'),
                    api.get('/shops')
                ]);
                setPlants(plantsRes.data);
                setShops(shopsRes.data);
            } catch (err) {
                console.error('Failed to load catalog:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredPlants = plants.filter((plant) => {
        const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory;
        const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plant.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="user-dashboard-wrapper container">
            {/* Hero Section */}
            <section className="hero-banner card animate-fade-in">
                <div className="hero-content">
                    <span className="badge badge-sage hero-badge">
                        <Sparkles size={14} /> Next-Gen SaaS Virtual Greenhouse
                    </span>
                    <h1>Bring Nature Home with 3D Plant Exploration</h1>
                    <p className="hero-subtitle">
                        Discover hand-crafted plants from verified local nurseries. Preview 3D plant models in real-time and take immersive 360° virtual nursery tours before buying.
                    </p>

                    <div className="hero-search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search plants by name (e.g. Monstera, Rubber Plant, ZZ Plant)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </section>

            {/* Featured Nurseries & Virtual Tours Bar */}
            {shops.length > 0 && (
                <section className="nurseries-bar-section">
                    <div className="section-header-inline">
                        <h2>
                            <Store size={22} color="#3A6B4E" /> Partner Nurseries
                        </h2>
                        <span className="section-subtitle">Take virtual 360° tours of local gardens</span>
                    </div>

                    <div className="nurseries-scroll-grid">
                        {shops.map((shop) => (
                            <div key={shop._id} className="nursery-mini-card card">
                                <img
                                    src={shop.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                                    alt={shop.shopName}
                                    className="nursery-thumb"
                                />
                                <div className="nursery-mini-info">
                                    <h4>{shop.shopName}</h4>
                                    <p className="nursery-location">{shop.address.split(',')[0] || shop.address}</p>

                                    {shop.virtualTourPath && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setActiveTour({ shopName: shop.shopName, tourPath: shop.virtualTourPath })}
                                        >
                                            <Compass size={14} /> 360° Virtual Tour
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Category Filters */}
            <section className="category-filter-section">
                <div className="filter-header">
                    <Filter size={18} color="#64748B" />
                    <span>Filter by Category:</span>
                </div>
                <div className="category-pills">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Plant Catalog Grid */}
            <section className="plant-catalog-section">
                <div className="catalog-header">
                    <h3>Explore Plant Catalog</h3>
                    <span className="catalog-count">{filteredPlants.length} plants available</span>
                </div>

                {loading ? (
                    <div className="loading-spinner-container">
                        <div className="spinner"></div>
                        <p>Fetching green goodness...</p>
                    </div>
                ) : filteredPlants.length === 0 ? (
                    <div className="empty-catalog card">
                        <Leaf size={48} color="#8DAA91" />
                        <h4>No Plants Found</h4>
                        <p>Try adjusting your search filter or select another category.</p>
                        <button className="btn btn-secondary" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="plant-grid">
                        {filteredPlants.map((plant) => (
                            <PlantCard key={plant._id} plant={plant} />
                        ))}
                    </div>
                )}
            </section>

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

export default UserDashboard;
