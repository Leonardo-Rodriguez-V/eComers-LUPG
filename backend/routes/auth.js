const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, birthdate, referralCode } = req.body;
    const birth = new Date(birthdate);
    const age = new Date().getFullYear() - birth.getFullYear();
    if (age < 18) return res.status(400).json({ message: 'Debes ser mayor de 18 años' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'Usuario o email ya existe' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash, birthdate: birth, referredBy: referralCode || null });

    if (email.toLowerCase().endsWith('@duocuc.cl') || email.toLowerCase().endsWith('@duoc.cl')) {
      user.points = 200;
    }
    await user.save();

    if (referralCode) {
      const referer = await User.findOne({ username: referralCode });
      if (referer) {
        referer.points = (referer.points || 0) + 50;
        await referer.save();
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role, points: user.points } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// GET /me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// PUT /profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.birthdate) updates.birthdate = req.body.birthdate;

    const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'El nombre de usuario o correo ya está en uso' });
    }
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

// POST /address
router.post('/address', verifyToken, async (req, res) => {
  try {
    const { alias, address, city, region, zip } = req.body;
    const user = await User.findById(req.user.id);
    user.addresses.push({ alias, address, city, region, zip });
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agregar dirección' });
  }
});

// DELETE /address/:id
router.delete('/address/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar dirección' });
  }
});

// GET /users - Admin listar todos
router.get('/users', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// PUT /users/:id - Admin editar usuario
router.put('/users/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
  try {
    const { username, email, role, points } = req.body;
    const updateData = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof points === 'number') updateData.points = points;
    
    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-passwordHash');
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'El nombre de usuario o correo ya está en uso' });
    }
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// DELETE /users/:id - Admin eliminar usuario
router.delete('/users/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;