const express = require('express');
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// GET todos los productos (público)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    console.log(`GET /products - Devolviendo ${products.length} productos`);
    res.json(products);
  } catch (error) {
    console.error('Error cargando productos:', error);
    res.status(500).json({ message: 'Error al cargar productos: ' + error.message });
  }
});

// POST crear (solo admin)
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
  const p = new Product(req.body);
  await p.save();
  res.status(201).json(p);
});

// PUT actualizar (solo admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
    
    console.log('PUT request para actualizar producto:', req.params.id);
    console.log('Datos enviados:', req.body);
    
    // Preparar datos para actualizar
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      code: req.body.code
    };
    
    // Si viene con imágenes, actualizar también
    if (req.body.images) {
      updateData.images = req.body.images;
    }
    
    console.log('Datos a actualizar en DB:', updateData);
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).lean();
    
    if (!updated) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    console.log('Producto actualizado exitosamente:', updated);
    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar: ' + error.message });
  }
});

// DELETE (solo admin)
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Eliminado' });
});

module.exports = router;