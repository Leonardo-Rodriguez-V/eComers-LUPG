require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        const users = await User.find({}, 'username email role');
        console.log('Usuarios encontrados:', users.length);
        users.forEach(u => console.log(`- ${u.username} (${u.email}) [${u.role}]`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

listUsers();
