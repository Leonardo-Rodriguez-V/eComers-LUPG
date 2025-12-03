// Script simple para poblar productos y crear admin
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/levelup';

const products = [
  { code: "JM001", category: "Juegos de Mesa", name: "Catan", images: ["catan.webp"], price: 29990, stock: 15, description: "Clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos." },
  { code: "JM002", category: "Juegos de Mesa", name: "Carcassonne", images: ["ima005.webp"], price: 24990, stock: 12, description: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender." },
  { code: "AC001", category: "Accesorios", name: "Control Xbox Series X", images: ["im006.webp"], price: 59990, stock: 8, description: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC." },
  { code: "PS001", category: "Consolas", name: "Play Station 5", images: ["im007.webp"], price: 549990, stock: 5, description: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva." },
  { code: "HG001", category: "Audio", name: "Auriculares Gamer HyperX Cloud II", images: ["im003.jpg"], price: 79990, stock: 20, description: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego." },
  { code: "GL001", category: "Computadoras", name: "Asus Rog Strix Scar 15 Gaming Laptop", images: ["im002.jpg"], price: 1299990, stock: 3, description: "Potente laptop para juegos con procesador Intel i7, tarjeta gráfica NVIDIA RTX 3060 y pantalla de 15.6\" Full HD a 300Hz para una experiencia de juego fluida y de alta calidad." },
  { code: "SG001", category: "Muebles", name: "Secretlab Titan Evo Frost", images: ["im017.jpg"], price: 349990, stock: 7, description: "Silla gamer diseñada para el máximo confort, con soporte ergonómico y personalización ajustable para sesiones prolongadas." },
  { code: "MG001", category: "Periféricos", name: "Mouse Gamer Logitech G502 HERO", images: ["im014.webp"], price: 49990, stock: 25, description: "Mouse gamer de alta precisión con sensor HERO 25K, 11 botones programables y retroiluminación RGB personalizable." },
  { code: "MP001", category: "Periféricos", name: "Mousepad Razer Goliathus Extended Chroma", images: ["im015.webp"], price: 29990, stock: 18, description: "Mousepad extendido con iluminación RGB personalizable, superficie optimizada para sensores ópticos y láser, y base antideslizante." },
  { code: "TS001", category: "Merchandising", name: "Polera Level UP Gamer", images: ["PoleraLevelUP.jpg"], price: 19990, stock: 30, description: "Polera de algodón 100% con diseño exclusivo de Level UP Gamer, cómoda y duradera." },
  { code: "RL001", category: "Hardware", name: "Refrigeración Líquida Cougar Poseidon Elite ARGB 240", images: ["im016.webp"], price: 70990, stock: 10, description: "Sistema de refrigeración líquida para CPU con radiador de 240mm, iluminación ARGB personalizable y bomba de alta eficiencia." },
  { code: "MG002", category: "Monitores", name: "Monitor Gamer Xiaomi G34, WQi, 180Hz", images: ["im013.webp"], price: 295990, stock: 6, description: "Monitor ultrawide de 34\" con resolución WQHD, tasa de refresco de 180Hz y tiempo de respuesta de 3ms, ideal para una experiencia de juego inmersiva y fluida." }
];

async function seed() {
  await mongoose.connect(mongoUri);
  console.log('Mongo connected for seeding');

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} productos cargados exitosamente`);

  // crear admin
  const existing = await User.findOne({ username: 'admin' });
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', email: 'admin@local', passwordHash: hash, birthdate: new Date('1990-01-01'), role: 'admin' });
    console.log('✅ Admin creado: admin / admin123');
  }

  mongoose.disconnect();
}
seed().catch(err => console.error(err));