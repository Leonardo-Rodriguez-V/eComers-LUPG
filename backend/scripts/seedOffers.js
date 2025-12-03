const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Offer = require('../models/Offer');

const offers = [
    {
        title: "Oferta del Mes: Teclado Inalámbrico",
        description: "El Teclado Multidispositivo Inalámbrico Inspire Smart TI707 redefine tu experiencia de juego con respuesta ultrarrápida.",
        price: 85990,
        image: "/assets/imag/Teclado_Inspire.jpg",
        active: true
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected for seeding offers...');
        await Offer.deleteMany({});
        await Offer.insertMany(offers);
        console.log('Offers seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
