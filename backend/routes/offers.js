const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const verifyToken = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

// GET all offers
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET active offer (for HomePage)
router.get('/active', async (req, res) => {
    try {
        // Find the most recent active offer
        const offer = await Offer.findOne({ active: true }).sort({ createdAt: -1 });
        res.json(offer || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new offer (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const offer = new Offer(req.body);
    try {
        const newOffer = await offer.save();
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update offer (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE offer (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Oferta eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
