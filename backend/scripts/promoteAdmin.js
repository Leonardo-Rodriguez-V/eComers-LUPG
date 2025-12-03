require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
    console.log('Uso: node promoteAdmin.js <email_del_usuario>');
    process.exit(1);
}

const promote = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Usuario con email ${email} no encontrado.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`¡Éxito! El usuario ${user.username} (${user.email}) ahora es ADMIN.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

promote();
