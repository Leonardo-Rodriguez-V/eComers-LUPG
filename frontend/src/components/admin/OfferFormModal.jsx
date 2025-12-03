import React, { useState, useEffect } from 'react';

export default function OfferFormModal({ show, onClose, onSave, offer }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image: '',
        active: true
    });

    useEffect(() => {
        if (offer) {
            setFormData({
                title: offer.title,
                description: offer.description,
                price: offer.price,
                image: offer.image,
                active: offer.active
            });
        } else {
            setFormData({
                title: '',
                description: '',
                price: '',
                image: '',
                active: true
            });
        }
    }, [offer, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content glass-panel border-0 text-white">
                    <div className="modal-header border-bottom border-secondary">
                        <h5 className="modal-title">{offer ? 'Editar Oferta' : 'Nueva Oferta'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <label className="form-label text-white-50 small">TÍTULO</label>
                                    <input type="text" className="form-control input-premium" name="title" value={formData.title} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white-50 small">PRECIO</label>
                                    <input type="number" className="form-control input-premium" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 d-flex align-items-center pt-4">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="activeSwitch" name="active" checked={formData.active} onChange={handleChange} />
                                        <label className="form-check-label text-white" htmlFor="activeSwitch">Oferta Activa</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white-50 small">URL IMAGEN</label>
                                    <input type="text" className="form-control input-premium" name="image" value={formData.image} onChange={handleChange} required placeholder="/assets/imag/..." />
                                    {formData.image && (
                                        <div className="mt-2 p-2 glass-panel text-center">
                                            <img src={formData.image} alt="Preview" style={{ maxHeight: '100px' }} onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white-50 small">DESCRIPCIÓN</label>
                                    <textarea className="form-control input-premium" name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
                                </div>
                            </div>
                            <div className="mt-4 d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-outline-light" onClick={onClose}>Cancelar</button>
                                <button type="submit" className="btn btn-premium">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
