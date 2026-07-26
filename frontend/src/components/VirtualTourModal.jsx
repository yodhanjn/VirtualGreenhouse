import React from 'react';
import { Compass, X, Maximize2 } from 'lucide-react';
import './VirtualTourModal.css';

const VirtualTourModal = ({ shopName, tourPath, onClose }) => {
    return (
        <div className="modal-backdrop animate-fade-in">
            <div className="modal-container virtual-tour-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <Compass size={22} color="#3A6B4E" />
                        <div>
                            <h3>Virtual Nursery Tour: {shopName}</h3>
                            <span className="subtitle">360° Interactive Panoramic Experience</span>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="modal-body virtual-tour-body">
                    {tourPath ? (
                        <iframe
                            src={tourPath}
                            title={`360 Virtual tour of ${shopName}`}
                            className="virtual-tour-iframe"
                            allowFullScreen
                        />
                    ) : (
                        <div className="tour-unavailable">
                            <Compass size={48} color="#8DAA91" />
                            <p>Virtual 360 Tour is currently undergoing maintenance for this nursery.</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <span className="hint-text">🌿 Drag to look around in 360 degrees. Use full-screen mode for immersion.</span>
                    <div className="tour-footer-actions">
                        {tourPath && (
                            <a href={tourPath} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                <Maximize2 size={14} /> Open Fullscreen
                            </a>
                        )}
                        <button className="btn btn-primary" onClick={onClose}>Exit Tour</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualTourModal;
