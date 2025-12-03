import React, { useState, useEffect } from 'react';

export default function ProductFormModal({ show, onClose, onSave, product }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: '', // Simplificado para manejar una URL principal
        code: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || '',
                price: product.price || '',
                stock: product.stock || '',
                description: product.description || '',
                image: product.images?.[0] || '',
                code: product.code || ''
            });
        } else {
            setFormData({
                name: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                image: '',
                code: ''
            });
        }
    }, [product, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Extraer solo el nombre del archivo de la ruta
        let imageName = formData.image;
        if (imageName.includes('/')) {
            imageName = imageName.split('/').pop();
        }
        // Convertir precio y stock a números, e imagen a array
        const data = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            images: [imageName]
        };
        console.log('Enviando datos de producto:', data);
        onSave(data);
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content glass-panel border-0 text-white">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title fw-bold">
                            {product ? 'Editar Producto' : 'Nuevo Producto'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label text-white-50 small">NOMBRE</label>
                                    <input type="text" className="input-premium w-100" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white-50 small">CÓDIGO</label>
                                    <input type="text" className="input-premium w-100" name="code" value={formData.code} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white-50 small">CATEGORÍA</label>
                                    <select className="input-premium w-100" name="category" value={formData.category} onChange={handleChange} required>
                                        <option value="">Seleccionar...</option>
                                        <option value="Consolas">Consolas</option>
                                        <option value="Juegos de Mesa">Juegos de Mesa</option>
                                        <option value="Accesorios">Accesorios</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Computadoras">Computadoras</option>
                                        <option value="Muebles">Muebles</option>
                                        <option value="Periféricos">Periféricos</option>
                                        <option value="Merchandising">Merchandising</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Monitores">Monitores</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label text-white-50 small">PRECIO</label>
                                    <input type="number" className="input-premium w-100" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label text-white-50 small">STOCK</label>
                                    <input type="number" className="input-premium w-100" name="stock" value={formData.stock} onChange={handleChange} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white-50 small">URL IMAGEN</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-dark border-secondary text-white-50">
                                            <i className="fas fa-image"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control input-premium"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            required
                                            placeholder="/assets/imag/ejemplo.jpg"
                                        />
                                    </div>
                                    <div className="form-text text-white-50 small mt-1">
                                        Para imágenes locales usa rutas relativas (ej: /assets/imag/catan.webp)
                                    </div>
                                    {formData.image && (
                                        <div className="mt-2 p-2 glass-panel text-center">
                                            <p className="small text-white-50 mb-1">Previsualización:</p>
                                            <img
                                                src={formData.image.startsWith('/') ? formData.image : `/assets/imag/${formData.image}`}
                                                alt="Preview"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '100px', objectFit: 'contain' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white-50 small">DESCRIPCIÓN</label>
                                    <textarea className="input-premium w-100" rows="3" name="description" value={formData.description} onChange={handleChange}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-secondary">
                            <button type="button" className="btn btn-outline-light" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-premium px-4">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
