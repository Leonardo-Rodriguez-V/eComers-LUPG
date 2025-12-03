import React, { useState, useEffect } from 'react';

export default function EventFormModal({ show, onClose, onSave, event }) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        image: '',
        tags: '',
        excerpt: '',
        details: '',
        lat: '',
        lng: ''
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
                location: event.location,
                image: event.image,
                tags: event.tags ? event.tags.join(', ') : '',
                excerpt: event.excerpt,
                details: event.details,
                lat: event.lat,
                lng: event.lng
            });
        } else {
            setFormData({
                title: '',
                date: '',
                location: '',
                image: '',
                tags: '',
                excerpt: '',
                details: '',
                lat: '',
                lng: ''
            });
        }
    }, [event, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        };
        onSave(dataToSave);
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content glass-panel border-0 text-white">
                    <div className="modal-header border-bottom border-secondary">
                        <h5 className="modal-title">{event ? 'Editar Evento' : 'Nuevo Evento'}</h5>
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
                                    <label className="form-label text-white-50 small">FECHA Y HORA</label>
                                    <input type="datetime-local" className="form-control input-premium" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white-50 small">UBICACIÓN (TEXTO)</label>
                                    <input type="text" className="form-control input-premium" name="location" value={formData.location} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white-50 small">LATITUD (MAPA)</label>
                                    <input type="number" step="any" className="form-control input-premium" name="lat" value={formData.lat} onChange={handleChange} required placeholder="-33.4..." />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white-50 small">LONGITUD (MAPA)</label>
                                    <input type="number" step="any" className="form-control input-premium" name="lng" value={formData.lng} onChange={handleChange} required placeholder="-70.6..." />
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
                                    <label className="form-label text-white-50 small">TAGS (Separados por coma)</label>
                                    <input type="text" className="form-control input-premium" name="tags" value={formData.tags} onChange={handleChange} placeholder="Torneo, Presencial, ..." />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white-50 small">RESUMEN CORTO</label>
                                    <textarea className="form-control input-premium" name="excerpt" rows="2" value={formData.excerpt} onChange={handleChange} required></textarea>
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white-50 small">DETALLES COMPLETOS</label>
                                    <textarea className="form-control input-premium" name="details" rows="4" value={formData.details} onChange={handleChange} required></textarea>
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
