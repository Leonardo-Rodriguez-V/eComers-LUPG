import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Contacto from "../components/Contacto";
import { mockOffer } from "../data/mockData";

export default function HomePage({ setCart, addToCart }) {
  const [offer, setOffer] = useState(null);
  const [loadingOffer, setLoadingOffer] = useState(true);
  const [expandedImage, setExpandedImage] = useState(null);

  const placeholder = "/assets/imag/placeholder.png";

  useEffect(() => {
    // Fetch active offer
    api.get('/offers/active')
      .then(res => {
        if (res.data) setOffer(res.data);
        else setOffer(mockOffer); // Fallback if no data
      })
      .catch(err => {
        console.error("Error fetching offer:", err);
        setOffer(mockOffer); // Fallback on error
      })
      .finally(() => setLoadingOffer(false));
  }, []);

  const handleAddOffer = () => {
    if (!offer) return;
    const product = {
      id: offer._id || 'offer-1',
      nombre: offer.title || 'Teclado Inspire',
      precio: offer.price || 899990,
      img: '/assets/imag/Teclado_Inspire.jpg',
      cantidad: 1
    };
    console.log('Agregando producto al carrito:', product);
    addToCart(product);
    toast.success("¡Oferta agregada al carrito!");
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center text-white position-relative" style={{ minHeight: '90vh', overflow: 'hidden' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ zIndex: -2 }}></div>
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 242, 0.15), transparent 60%)',
            zIndex: -1
          }}>
        </div>

        <div className="container position-relative z-1">
          <div className="row align-items-center gap-4">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-2 fw-bold mb-4 text-shadow-neon" style={{ letterSpacing: '2px' }}>
                LEVEL UP <span className="text-primary">GAMER</span>
              </h1>
              <p className="lead mb-5" style={{ maxWidth: '600px', color: '#e0e0e0' }}>
                Tu destino definitivo para hardware de alto rendimiento, periféricos de élite y la comunidad más apasionada.
              </p>
              <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                <Link to="/catalogo" className="btn btn-premium btn-lg px-5 py-3 fw-bold">
                  VER CATÁLOGO
                </Link>
                <a href="#oferta" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold">
                  OFERTAS
                </a>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block text-center">
              <img
                src="/assets/imag/bann.PNG"
                alt="Level Up Gamer Banner"
                className="img-fluid"
                style={{ 
                  maxHeight: '550px', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 30px rgba(0, 255, 136, 0.4)) drop-shadow(0 0 60px rgba(100, 108, 255, 0.2))',
                  borderRadius: '16px',
                  border: '2px solid rgba(0, 255, 136, 0.3)',
                  padding: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 40px rgba(0, 255, 136, 0.6)) drop-shadow(0 0 80px rgba(100, 108, 255, 0.3))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(0, 255, 136, 0.4)) drop-shadow(0 0 60px rgba(100, 108, 255, 0.2))';
                }}
                onError={(e) => (e.currentTarget.src = placeholder)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Origen e impacto */}
      <section className="container py-5" id="origen-impacto">
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-6 mb-4">
            <div className="card h-100 shadow-lg neon-section" style={{ background: "#141A28" }}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <span className="display-6 me-2" style={{ color: "#00f7ff" }}>
                    <i className="fas fa-industry fa-2x" />
                  </span>
                  <h2 className="neon-title mb-0" style={{ color: "#00f7ff" }}>
                    Origen de Productos
                  </h2>
                </div>
                <p className="mb-3 text-white fs-5">Calidad y autenticidad garantizadas</p>
                <h5 className="mb-3 text-white fw-bold">
                  Certificaciones Oficiales
                </h5>
                <ul className="list-group list-group-flush fs-6">
                  <li className="list-group-item bg-transparent text-white border-0">
                    <i className="fas fa-check-circle me-2" style={{ color: "#00ff72" }} /> Sony Interactive Entertainment
                  </li>
                  <li className="list-group-item bg-transparent text-white border-0">
                    <i className="fas fa-check-circle me-2" style={{ color: "#00ff72" }} /> Microsoft Xbox
                  </li>
                  <li className="list-group-item bg-transparent text-white border-0">
                    <i className="fas fa-check-circle me-2" style={{ color: "#00ff72" }} /> Nintendo Co., Ltd.
                  </li>
                  <li className="list-group-item bg-transparent text-white border-0">
                    <i className="fas fa-check-circle me-2" style={{ color: "#00ff72" }} /> SteelSeries
                  </li>
                </ul>
                <div className="mt-3">
                  <span className="badge bg-info text-dark me-1">Distribución Oficial</span>
                  <span className="badge bg-primary">Producto Original</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card h-100 shadow-lg neon-section" style={{ background: "#181825" }}>
              <div className="card-body text-center">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <span className="display-6 me-2" style={{ color: "#00ff72" }}>
                    <i className="fas fa-users fa-2x" />
                  </span>
                  <h2 className="neon-title mb-0" style={{ color: "#00ff72" }}>
                    Impacto Comunitario
                  </h2>
                </div>
                <p className="fs-5 text-white mb-4">
                  Tus compras <span style={{ color: "#00ff72", fontWeight: "bold" }}>impulsan la comunidad gamer</span>.
                </p>
                <div className="row g-2 justify-content-center mb-3">
                  <div className="col-6 text-center">
                    <div className="py-3 px-2 rounded bg-dark border border-success shadow-sm">
                      <div className="fs-2 mb-1" style={{ color: "#00ff72" }}>
                        <i className="fas fa-calendar-check" /> +1,200
                      </div>
                      <div className="text-white">Eventos apoyados</div>
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    <div className="py-3 px-2 rounded bg-dark border border-info shadow-sm">
                      <div className="fs-2 mb-1" style={{ color: "#00f7ff" }}>
                        <i className="fas fa-money-bill-wave" /> $2.5M
                      </div>
                      <div className="text-white">Invertidos en comunidad</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="badge bg-success me-1">¡Gracias por ser parte!</span>
                  <span className="badge bg-warning text-dark">Apoya el mundo gamer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Section */}
      {offer && (
        <section id="oferta" className="py-5 bg-darker position-relative">
          <div className="container">
            <div className="glass-panel h-100">
              <div className="card-body d-flex flex-column p-5">
                <div className="row align-items-center flex-grow-1">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <div className="text-center mb-4">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="img-fluid rounded shadow-lg hover-scale"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    {/* Galería de muestra de teclado */}
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <img 
                        src="/assets/imag/teclado1.webp" 
                        alt="Vista 1" 
                        className="rounded shadow-sm" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease', }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.3) translateZ(0)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,255,136,0.5)';
                          e.currentTarget.style.zIndex = '10';
                          e.currentTarget.style.borderColor = 'rgba(0,255,136,0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.zIndex = '1';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                        onClick={() => setExpandedImage('/assets/imag/teclado1.webp')}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                      <img 
                        src="/assets/imag/teclado2.webp" 
                        alt="Vista 2" 
                        className="rounded shadow-sm" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.3) translateZ(0)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,255,136,0.5)';
                          e.currentTarget.style.zIndex = '10';
                          e.currentTarget.style.borderColor = 'rgba(0,255,136,0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.zIndex = '1';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                        onClick={() => setExpandedImage('/assets/imag/teclado2.webp')}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                      <img 
                        src="/assets/imag/teclado3.webp" 
                        alt="Vista 3" 
                        className="rounded shadow-sm" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.3) translateZ(0)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,255,136,0.5)';
                          e.currentTarget.style.zIndex = '10';
                          e.currentTarget.style.borderColor = 'rgba(0,255,136,0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.zIndex = '1';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                        onClick={() => setExpandedImage('/assets/imag/teclado3.webp')}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                      <img 
                        src="/assets/imag/teclado4.webp" 
                        alt="Vista 4" 
                        className="rounded shadow-sm" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.3) translateZ(0)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,255,136,0.5)';
                          e.currentTarget.style.zIndex = '10';
                          e.currentTarget.style.borderColor = 'rgba(0,255,136,0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.zIndex = '1';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                        onClick={() => setExpandedImage('/assets/imag/teclado4.webp')}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 text-white">
                    <h2 className="display-5 fw-bold mb-3 text-primary">OFERTA DEL MES</h2>
                    <h3 className="h2 mb-4">{offer.title}</h3>
                    <p className="lead mb-4 text-white-50">
                      {offer.description}
                    </p>
                    <div className="d-flex align-items-center gap-4 mb-4">
                      <span className="display-6 fw-bold text-success">${offer.price?.toLocaleString('es-CL')}</span>
                      <span className="text-decoration-line-through text-muted fs-4">${(offer.price * 1.2).toLocaleString('es-CL')}</span>
                    </div>
                    <button
                      onClick={handleAddOffer}
                      className="btn btn-premium btn-lg w-100"
                    >
                      <i className="fas fa-shopping-cart me-2"></i> COMPRAR AHORA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog (resumen) */}
      <section id="blog" className="py-5 game-section">
        <div className="container">
          <h2 className="section-title">📰 ÚLTIMAS NOTICIAS GAMER</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="blog-card">
                <div className="card-header p-0 border-0">
                  <img src="/assets/imag/setup.avif" alt="Setup Gamer" className="blog-image" onError={(e) => (e.currentTarget.src = placeholder)} />
                </div>
                <div className="card-body">
                  <h3>Guía Definitiva para tu Setup</h3>
                  <p>Aprende a optimizar tu espacio de juego para máximo confort y rendimiento.</p>
                  <div className="card-footer">
                    <a href="https://www.hp.com/cl-es/shop/tech-takes/guia-setup-gaming-profesional" className="btn btn-sm btn-outline-light" target="_blank" rel="noreferrer">
                      Leer más <i className="fas fa-arrow-right ms-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="blog-card">
                <div className="card-header p-0 border-0">
                  <img src="/assets/imag/im012.webp" alt="Tráiler de GTA 6" className="blog-image" onError={(e) => (e.currentTarget.src = placeholder)} />
                </div>
                <div className="card-body">
                  <h3>¡Mira el Tráiler de GTA 6!</h3>
                  <p>No te pierdas el emocionante tráiler de GTA 6 que ha revolucionado internet.</p>
                  <div className="card-footer">
                    <a href="https://www.rockstargames.com/VI" className="btn btn-sm btn-outline-light" target="_blank" rel="noreferrer">
                      Ver Tráiler <i className="fas fa-arrow-right ms-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="blog-card">
                <div className="card-header p-0 border-0">
                  <img src="/assets/imag/afiche.png" alt="Torneos" className="blog-image" onError={(e) => (e.currentTarget.src = placeholder)} />
                </div>
                <div className="card-body">
                  <h3>Próximos Torneos Locales</h3>
                  <p>Inscríbete en los torneos de Valorant y LoL que se vienen este mes.</p>
                  <div className="card-footer">
                    <Link to="/eventos" className="btn btn-sm btn-outline-light">
                      Ver Eventos <i className="fas fa-arrow-right ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <Contacto />

      {/* Modal/Lightbox para imagen expandida */}
      {expandedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setExpandedImage(null)}
        >
          {/* Botón Cerrar (X) */}
          <button
            onClick={() => setExpandedImage(null)}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              border: 'none',
              color: '#000',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              fontSize: '28px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,255,136,0.6)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,136,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,136,0.6)';
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Imagen expandida */}
          <img
            src={expandedImage}
            alt="Imagen expandida"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 0 40px rgba(0,255,136,0.5)',
              border: '2px solid rgba(0,255,136,0.4)',
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => (e.currentTarget.src = placeholder)}
          />
        </div>
      )}
    </div>
  );
}