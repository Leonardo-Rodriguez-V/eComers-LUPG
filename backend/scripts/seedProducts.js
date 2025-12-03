require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const PRODUCTS = [
    { code: "JM001", name: "Catan", category: "Juegos", images: ["/assets/imag/catan.webp"], price: 29990, description: "Clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.", stock: 50 },
    { code: "JM002", name: "Carcassonne", category: "Juegos", images: ["/assets/imag/ima005.webp"], price: 24990, description: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.", stock: 40 },
    { code: "AC001", name: "Control Xbox Series X", category: "Accesorios", images: ["/assets/imag/im006.webp"], price: 59990, description: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.", stock: 30 },
    { code: "PS001", name: "PlayStation 5", category: "Consolas", images: ["/assets/imag/im007.webp"], price: 549990, description: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.", stock: 10 },
    { code: "HG001", name: "Auriculares Gamer HyperX Cloud II", category: "Accesorios", images: ["/assets/imag/im003.jpg"], price: 79990, description: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.", stock: 25 },
    { code: "GL001", name: "Asus Rog Strix Scar 15 Gaming Laptop", category: "Consolas", images: ["/assets/imag/im002.jpg"], price: 1299990, description: "Potente laptop para juegos con procesador Intel i7, tarjeta gráfica NVIDIA RTX 3060 y pantalla de 15.6\" Full HD a 300Hz para una experiencia de juego fluida y de alta calidad.", stock: 5 },
    { code: "SG001", name: "Secretlab Titan Evo Frost", category: "Sillas", images: ["/assets/imag/im017.jpg"], price: 349990, description: "Silla gamer diseñada para el máximo confort, con soporte ergonómico y personalización ajustable para sesiones prolongadas.", stock: 15 },
    { code: "MG001", name: "Mouse Gamer Logitech G502 HERO", category: "Accesorios", images: ["/assets/imag/im014.webp"], price: 49990, description: "Mouse gamer de alta precisión con sensor HERO 25K, 11 botones programables y retroiluminación RGB personalizable.", stock: 60 },
    { code: "MP001", name: "Mousepad Razer Goliathus Extended Chroma", category: "Accesorios", images: ["/assets/imag/im015.webp"], price: 29990, description: "Mousepad extendido con iluminación RGB personalizable, superficie optimizada para sensores ópticos y láser, y base antideslizante.", stock: 45 },
    { code: "TS001", name: "Polera Level UP Gamer", category: "Accesorios", images: ["/assets/imag/PoleraLevelUP.jpg"], price: 19990, description: "Polera de algodón 100% con diseño exclusivo de Level UP Gamer, cómoda y duradera.", stock: 100 },
    { code: "RL001", name: "Refrigeración Líquida Cougar Poseidon Elite ARGB 240", category: "Accesorios", images: ["/assets/imag/im016.webp"], price: 70990, description: "Sistema de refrigeración líquida para CPU con radiador de 240mm, iluminación ARGB personalizable y bomba de alta eficiencia.", stock: 20 },
    { code: "MG002", name: "Monitor Gamer Xiaomi G34, WQi, 180Hz", category: "Accesorios", images: ["/assets/imag/im013.webp"], price: 295990, description: "Monitor ultrawide de 34\" con resolución WQHD, tasa de refresco de 180Hz y tiempo de respuesta de 3ms, ideal para una experiencia de juego inmersiva y fluida.", stock: 12 }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        // Opcional: Limpiar productos existentes
        await Product.deleteMany({});
        console.log('Productos existentes eliminados.');

        await Product.insertMany(PRODUCTS);
        console.log(`¡Éxito! Se insertaron ${PRODUCTS.length} productos.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();
