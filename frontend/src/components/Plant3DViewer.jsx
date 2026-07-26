import React, { useState } from 'react';
import { Box, X, RefreshCw, Eye } from 'lucide-react';
import './Plant3DViewer.css';

const Plant3DViewer = ({ plantName, model3dGlb, model3dHtml, onClose }) => {
    const [viewerType, setViewerType] = useState(model3dGlb ? 'glb' : 'html');

    return (
        <div className="modal-backdrop animate-fade-in">
            <div className="modal-container plant-3d-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <Box size={20} color="#3A6B4E" />
                        <h3>3D Interactive View: {plantName}</h3>
                    </div>
                    <div className="modal-header-actions">
                        {model3dGlb && model3dHtml && (
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setViewerType(viewerType === 'glb' ? 'html' : 'glb')}
                            >
                                <RefreshCw size={14} />
                                Switch to {viewerType === 'glb' ? 'HTML Mode' : '3D Canvas'}
                            </button>
                        )}
                        <button className="modal-close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="modal-body plant-3d-body">
                    {viewerType === 'glb' && model3dGlb ? (
                        <div className="model-viewer-wrapper">
                            <model-viewer
                                src={model3dGlb}
                                alt={`3D model of ${plantName}`}
                                auto-rotate
                                camera-controls
                                shadow-intensity="1"
                                stage-light
                                style={{ width: '100%', height: '100%', minHeight: '420px', backgroundColor: '#F0F4EF' }}
                            >
                                <div slot="poster" className="model-viewer-loader">
                                    <div className="spinner"></div>
                                    <p>Loading 3D Model...</p>
                                </div>
                            </model-viewer>
                        </div>
                    ) : model3dHtml ? (
                        <iframe
                            src={model3dHtml}
                            title={`3D view of ${plantName}`}
                            className="model-iframe"
                        />
                    ) : (
                        <div className="no-model-fallback">
                            <Eye size={40} color="#8DAA91" />
                            <p>3D Preview is currently initializing for this plant species.</p>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <span className="hint-text">💡 Tip: Click and drag to rotate the plant 360°. Scroll to zoom in/out.</span>
                    <button className="btn btn-primary" onClick={onClose}>Close Viewer</button>
                </div>
            </div>
        </div>
    );
};

export default Plant3DViewer;
