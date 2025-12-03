const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Crear nueva orden
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        let total = 0;
        const orderItems = [];

        // Validar stock y calcular total
        for (const item of items) {
            const product = await Product.findById(item.id);
            if (!product) {
                return res.status(404).json({ message: `Producto no encontrado: ${item.name}` });
            }
            if (product.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para: ${product.name}` });
            }

            // Descontar stock
            product.stock -= item.cantidad;
            await product.save();

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.cantidad
            });

            total += product.price * item.cantidad;
        }

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            total,
            shippingAddress: shippingAddress || 'Dirección por defecto',
            status: 'paid' // Simulamos pago exitoso directo
        });

        await order.save();
        res.status(201).json(order);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al procesar la orden' });
    }
});

// GET /api/orders/mine - Historial del usuario
router.get('/mine', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener historial' });
    }
});

// GET /api/orders - Admin ver todas (Opcional)
router.get('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
    try {
        const orders = await Order.find().populate('user', 'username email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
});

// PUT /api/orders/:id/status - Admin cambiar estado
router.put('/:id/status', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
    try {
        const { status } = req.body;
        const validStates = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStates.includes(status)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }
        
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'username email');
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar estado' });
    }
});

// DELETE /api/orders/:id - Admin eliminar orden
router.delete('/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        res.json({ message: 'Orden eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar orden' });
    }
});

module.exports = router;
