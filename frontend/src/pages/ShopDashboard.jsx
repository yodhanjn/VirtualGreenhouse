import React, { useState, useEffect } from 'react';
import { Store, Plus, Edit, Trash2, Package, CheckCircle, Clock, AlertCircle, Image, Box, RefreshCw, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './ShopDashboard.css';

const CATEGORIES = ['Indoor', 'Outdoor', 'Succulent', 'Herb', 'Flowering', 'Foliage', 'Indoor & Air-Purifying'];

const ShopDashboard = () => {
    const { user } = useAuth();
    const [plants, setPlants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'settings'
    const [loading, setLoading] = useState(true);

    // Modal state for Add/Edit Plant
    const [showPlantModal, setShowPlantModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState(null);
    const [plantForm, setPlantForm] = useState({
        name: '',
        category: 'Indoor',
        description: '',
        price: '',
        stockQuantity: 10,
        inStock: true,
        model3dGlb: '',
        model3dHtml: '',
        isFeatured: false,
        image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [plantsRes, ordersRes] = await Promise.all([
                api.get(`/plants?shop=${user._id}`),
                api.get('/orders/shop')
            ]);
            setPlants(plantsRes.data);
            setOrders(ordersRes.data);
        } catch (err) {
            console.error('Failed to load shop dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const handleOpenAddModal = () => {
        setEditingPlant(null);
        setPlantForm({
            name: '',
            category: 'Indoor',
            description: '',
            price: '',
            stockQuantity: 10,
            inStock: true,
            model3dGlb: '',
            model3dHtml: '',
            isFeatured: false,
            image: ''
        });
        setImageFile(null);
        setErrorMsg('');
        setShowPlantModal(true);
    };

    const handleOpenEditModal = (plant) => {
        setEditingPlant(plant);
        setPlantForm({
            name: plant.name,
            category: plant.category,
            description: plant.description,
            price: plant.price,
            stockQuantity: plant.stockQuantity || 0,
            inStock: plant.inStock,
            model3dGlb: plant.model3dGlb || '',
            model3dHtml: plant.model3dHtml || '',
            isFeatured: plant.isFeatured || false,
            image: plant.image || ''
        });
        setImageFile(null);
        setErrorMsg('');
        setShowPlantModal(true);
    };

    const handleSavePlant = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg('');

        try {
            const formData = new FormData();
            formData.append('name', plantForm.name);
            formData.append('category', plantForm.category);
            formData.append('description', plantForm.description);
            formData.append('price', plantForm.price);
            formData.append('stockQuantity', plantForm.stockQuantity);
            formData.append('inStock', plantForm.inStock);
            formData.append('model3dGlb', plantForm.model3dGlb);
            formData.append('model3dHtml', plantForm.model3dHtml);
            formData.append('isFeatured', plantForm.isFeatured);

            if (imageFile) {
                formData.append('image', imageFile);
            } else {
                formData.append('image', plantForm.image);
            }

            if (editingPlant) {
                await api.put(`/plants/${editingPlant._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/plants', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setShowPlantModal(false);
            fetchData();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Error saving plant listing');
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePlant = async (plantId) => {
        if (window.confirm('Are you sure you want to delete this plant listing?')) {
            try {
                await api.delete(`/plants/${plantId}`);
                fetchData();
            } catch (err) {
                alert('Failed to delete plant listing');
            }
        }
    };

    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchData();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    return (
        <div className="shop-dashboard-wrapper container">
            {/* Header Profile Bar */}
            <div className="shop-profile-banner card animate-fade-in">
                <div className="shop-avatar-box">
                    <img
                        src={user?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                        alt={user?.shopName}
                        className="shop-avatar"
                    />
                </div>
                <div className="shop-banner-info">
                    <div className="shop-title-row">
                        <h2>{user?.shopName}</h2>
                        <span className="badge badge-success">Seller Verified</span>
                    </div>
                    <p className="shop-banner-desc">{user?.description}</p>
                    <p className="shop-location-text">{user?.address}</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="shop-stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon-box sage">
                        <Store size={24} color="#3A6B4E" />
                    </div>
                    <div>
                        <span className="stat-label">Active Plant Listings</span>
                        <h3 className="stat-value">{plants.length}</h3>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-box blue">
                        <Package size={24} color="#2563EB" />
                    </div>
                    <div>
                        <span className="stat-label">Total Received Orders</span>
                        <h3 className="stat-value">{orders.length}</h3>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-box amber">
                        <Clock size={24} color="#D97706" />
                    </div>
                    <div>
                        <span className="stat-label">Pending Orders</span>
                        <h3 className="stat-value">{orders.filter(o => o.status === 'Pending').length}</h3>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="shop-dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    <Store size={18} /> Plant Inventory ({plants.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <Package size={18} /> Orders Board ({orders.length})
                </button>
            </div>

            {/* Tab 1: Plant Inventory */}
            {activeTab === 'inventory' && (
                <section className="inventory-section">
                    <div className="section-toolbar">
                        <h3>Manage Plant Catalog</h3>
                        <button className="btn btn-primary" onClick={handleOpenAddModal}>
                            <Plus size={18} /> Add New Plant Listing
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-spinner-container">
                            <div className="spinner"></div>
                        </div>
                    ) : plants.length === 0 ? (
                        <div className="card empty-state">
                            <Store size={48} color="#8DAA91" />
                            <h4>No plants listed yet</h4>
                            <p>Click "Add New Plant Listing" to start selling on Virtual Greenhouse.</p>
                            <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ marginTop: '12px' }}>
                                Add First Plant
                            </button>
                        </div>
                    ) : (
                        <div className="inventory-table-card card">
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        <th>Plant</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock Qty</th>
                                        <th>3D Model</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plants.map((plant) => (
                                        <tr key={plant._id}>
                                            <td className="plant-cell">
                                                <img
                                                    src={plant.image}
                                                    alt={plant.name}
                                                    className="plant-table-thumb"
                                                />
                                                <div>
                                                    <strong className="plant-name-text">{plant.name}</strong>
                                                    <span className="plant-sub-text">{plant.description.substring(0, 45)}...</span>
                                                </div>
                                            </td>
                                            <td><span className="badge badge-sage">{plant.category}</span></td>
                                            <td className="price-text">₹{plant.price.toLocaleString('en-IN')}</td>
                                            <td>{plant.stockQuantity} pcs</td>
                                            <td>
                                                {plant.model3dGlb ? (
                                                    <span className="badge badge-sage"><Box size={12} /> 3D Ready</span>
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>None</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${plant.inStock ? 'badge-success' : 'badge-warning'}`}>
                                                    {plant.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="action-icon-btn edit"
                                                        onClick={() => handleOpenEditModal(plant)}
                                                        title="Edit Plant"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="action-icon-btn delete"
                                                        onClick={() => handleDeletePlant(plant._id)}
                                                        title="Delete Listing"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}

            {/* Tab 2: Orders Board */}
            {activeTab === 'orders' && (
                <section className="orders-section">
                    <div className="section-toolbar">
                        <h3>Customer Orders ({orders.length})</h3>
                    </div>

                    {orders.length === 0 ? (
                        <div className="card empty-state">
                            <Package size={48} color="#8DAA91" />
                            <h4>No customer orders received yet</h4>
                        </div>
                    ) : (
                        <div className="orders-list-grid">
                            {orders.map((order) => (
                                <div key={order._id} className="card order-item-card animate-fade-in">
                                    <div className="order-item-header">
                                        <div>
                                            <span className="order-id-text">Order #{order._id.substring(order._id.length - 8)}</span>
                                            <span className="order-date-text">{new Date(order.orderDate).toLocaleDateString()}</span>
                                        </div>

                                        <div className="status-selector-wrapper">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                                className={`status-select status-${order.status.toLowerCase()}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="order-customer-box">
                                        <p><strong>Customer:</strong> {order.user?.name || 'Buyer'}</p>
                                        <p><strong>Address:</strong> {order.shippingAddress}</p>
                                        <p><strong>Payment:</strong> {order.paymentMethod}</p>
                                    </div>

                                    <div className="order-items-list">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="order-sub-item">
                                                <span>{item.plantName} x {item.quantity}</span>
                                                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-total-footer">
                                        <span>Total Amount</span>
                                        <strong className="total-price">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Add / Edit Plant Modal */}
            {showPlantModal && (
                <div className="modal-backdrop animate-fade-in">
                    <div className="modal-container plant-form-modal">
                        <div className="modal-header">
                            <h3>{editingPlant ? 'Edit Plant Listing' : 'Add New Plant Listing'}</h3>
                            <button className="modal-close-btn" onClick={() => setShowPlantModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePlant} className="modal-body form-body">
                            {errorMsg && (
                                <div className="auth-error-alert">
                                    <AlertCircle size={16} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Plant Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={plantForm.name}
                                        onChange={(e) => setPlantForm({ ...plantForm, name: e.target.value })}
                                        placeholder="Monstera Deliciosa"
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={plantForm.category}
                                        onChange={(e) => setPlantForm({ ...plantForm, category: e.target.value })}
                                        className="input-field"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={plantForm.price}
                                        onChange={(e) => setPlantForm({ ...plantForm, price: e.target.value })}
                                        placeholder="1299"
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={plantForm.stockQuantity}
                                        onChange={(e) => setPlantForm({ ...plantForm, stockQuantity: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={plantForm.description}
                                    onChange={(e) => setPlantForm({ ...plantForm, description: e.target.value })}
                                    placeholder="Describe plant care, light requirements, and soil needs..."
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label>Plant Image File or Image URL</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="input-field"
                                />
                                {!imageFile && (
                                    <input
                                        type="text"
                                        placeholder="Or paste image URL (https://...)"
                                        value={plantForm.image}
                                        onChange={(e) => setPlantForm({ ...plantForm, image: e.target.value })}
                                        className="input-field"
                                        style={{ marginTop: '8px' }}
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label>3D Model GLB File Path (Optional)</label>
                                <input
                                    type="text"
                                    value={plantForm.model3dGlb}
                                    onChange={(e) => setPlantForm({ ...plantForm, model3dGlb: e.target.value })}
                                    placeholder="e.g. /Plant3D/croton_plant.glb"
                                    className="input-field"
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowPlantModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Plant Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopDashboard;
