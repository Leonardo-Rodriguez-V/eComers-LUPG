const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Event = require('../models/Event');

const events = [
    {
        title: "Torneo Level UP - Smash Ultimate",
        date: new Date("2025-12-04T18:00:00"),
        location: "Arena Central, Santiago",
        image: "/assets/imag/evento1.png",
        tags: ["Torneo", "Presencial", "Competitivo"],
        excerpt: "Participa en el torneo regional de Smash Ultimate. Premios, streaming y mucha emoción.",
        details: "Regístrate con anticipación. Cupos limitados. Habrá premios, transmisión en vivo y zona de sponsors. Lleva tu control o usa uno de los de la casa.",
        lat: -33.4429,
        lng: -70.6518,
    },
    {
        title: "Charla: Desarrollo de videojuegos indie",
        date: new Date("2025-11-22T16:00:00"),
        location: "Auditorio Online (Zoom)",
        image: "/assets/imag/evento2.png",
        tags: ["Charla", "Online", "Educación"],
        excerpt: "Aprende cómo lanzar tu primer juego indie con invitados expertos del rubro.",
        details: "Hablaremos sobre producción, marketing y monetización. Se entregará certificado digital para los asistentes que completen la encuesta post-evento.",
        lat: -33.45694,
        lng: -70.64827,
    },
    {
        title: "Meetup Retro Gamers",
        date: new Date("2025-10-11T20:30:00"),
        location: "Bar Pixel",
        image: "/assets/imag/evento3.png",
        tags: ["Social", "Presencial", "Retro"],
        excerpt: "Noche de juegos retro con torneos casuales y premios sorpresa.",
        details: "Trae tu consola retro o juega en nuestras máquinas. Entrada liberada los primeros 50.",
        lat: -33.4475,
        lng: -70.6731,
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected for seeding events...');
        await Event.deleteMany({});
        await Event.insertMany(events);
        console.log('Events seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
