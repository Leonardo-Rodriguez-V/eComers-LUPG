export const mockProducts = [
    {
        _id: "1",
        name: "PlayStation 5 Pro",
        price: 799990,
        description: "La consola más potente de Sony con trazado de rayos avanzado y soporte 8K.",
        images: ["/assets/imag/ps5.jpg"],
        category: "Consolas"
    },
    {
        _id: "2",
        name: "Xbox Series X",
        price: 649990,
        description: "La Xbox más rápida y potente de la historia. Juega miles de títulos de cuatro generaciones de consolas.",
        images: ["/assets/imag/xbox.jpg"],
        category: "Consolas"
    },
    {
        _id: "3",
        name: "Nintendo Switch OLED",
        price: 349990,
        description: "Pantalla OLED de 7 pulgadas, soporte ancho ajustable y audio mejorado.",
        images: ["/assets/imag/switch.jpg"],
        category: "Consolas"
    },
    {
        _id: "4",
        name: "Mouse Logitech G Pro X",
        price: 129990,
        description: "Diseñado con profesionales de eSports. Ultraligero y con sensor HERO 25K.",
        images: ["/assets/imag/mouse.jpg"],
        category: "Periféricos"
    },
    {
        _id: "5",
        name: "Teclado Razer BlackWidow V4",
        price: 189990,
        description: "Teclado mecánico con switches verdes clicky y retroiluminación Chroma RGB.",
        images: ["/assets/imag/keyboard.jpg"],
        category: "Periféricos"
    },
    {
        _id: "6",
        name: "Monitor ASUS ROG Swift",
        price: 899990,
        description: "360Hz, 1ms, HDR. La ventaja competitiva definitiva para gamers profesionales.",
        images: ["/assets/imag/monitor.jpg"],
        category: "Monitores"
    }
];

export const mockOffer = {
    _id: "offer1",
    title: "Pack Gamer Supremo",
    description: "Lleva tu experiencia al siguiente nivel con este pack que incluye PS5, Headset Pulse 3D y Control DualSense extra.",
    price: 899990,
    image: "/assets/imag/bundle-ps5.jpg"
};

export const mockEvents = [
    {
        _id: "evt1",
        title: "Torneo Valorant Regional",
        date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 días más
        location: "Arena Movistar, Santiago",
        image: "/assets/imag/valorant.jpg",
        excerpt: "Compite por un premio de $5.000.000 CLP. Inscripciones abiertas para equipos.",
        details: "El torneo más grande de la región. Formato 5v5. Premios en efectivo y periféricos para los finalistas.",
        lat: -33.4623,
        lng: -70.6612,
        tags: ["E-Sports", "FPS", "Presencial"]
    },
    {
        _id: "evt2",
        title: "Lanzamiento GTA VI - Watch Party",
        date: new Date(Date.now() + 86400000 * 12).toISOString(),
        location: "Level Up Lounge, Providencia",
        image: "/assets/imag/gta6-event.jpg",
        excerpt: "Ven a ver el gameplay exclusivo y celebra con nosotros el lanzamiento más esperado.",
        details: "Bebidas y snacks temáticos. Sorteos de copias del juego y merch oficial.",
        lat: -33.4265,
        lng: -70.6112,
        tags: ["Comunidad", "Lanzamiento", "Social"]
    },
    {
        _id: "evt3",
        title: "Taller de Armado de PC",
        date: new Date(Date.now() + 86400000 * 20).toISOString(),
        location: "Tienda Level Up, Las Condes",
        image: "/assets/imag/pc-build.jpg",
        excerpt: "Aprende desde cero a armar tu propia máquina gamer con expertos.",
        details: "Incluye materiales de práctica. Trae tus componentes o practica con los nuestros.",
        lat: -33.4105,
        lng: -70.5723,
        tags: ["Workshop", "Hardware", "Educativo"]
    }
];
