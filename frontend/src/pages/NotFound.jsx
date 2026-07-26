import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="container" style={{ padding: '100px 20px', textCenter: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '48px', textCenter: 'center' }}>
                <Leaf size={64} color="#3A6B4E" style={{ margin: '0 auto 20px', display: 'block' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>404 - Page Not Found</h2>
                <p style={{ color: '#64748B', marginBottom: '28px' }}>
                    The page or plant path you are looking for does not exist or has moved.
                </p>
                <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> Return to Home Catalog
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
