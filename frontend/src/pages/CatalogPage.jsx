import React, { useMemo, useState, useEffect } from "react";
import ImageWithFallback from "../components/ImageWithFallback";
import { toast } from "react-toastify";
import api from "../services/api";
import { mockProducts } from "../data/mockData";

/*
  CatalogPage
  - Obtiene productos desde el backend.
  - Acepta addToCart (recomendado) o setCart (compatibilidad).
*/

const formatter = new Intl.NumberFormat("es-CL");

export default function CatalogPage({ addToCart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const placeholder = "/assets/imag/placeholder.png";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
        // Fallback to mock data
        setProducts(mockProducts);
        toast.info("Mostrando catálogo de demostración");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => (p.name + " " + p.description).toLowerCase().includes(q));
  }, [query, products]);

  // Helper interno: intenta usar addToCart (preferido). Si no existe, usa setCart por compatibilidad.
  const handleAdd = (p) => {
    // Adaptar estructura de producto de BD a lo que espera el carrito
    const item = {
      id: p._id, // Usamos _id de Mongo
      nombre: p.name,
      precio: p.price,
      cantidad: 1,
      img: p.images?.[0] ? `/assets/imag/${p.images[0]}` : placeholder,
      category: p.category
    };

    if (typeof addToCart === "function") {
      addToCart(item);
      toast.success(`${p.name} agregado al carrito`, { toastId: `cart-${p._id}` });
      return;
    }

    // Compatibilidad con setCart (antiguo)
    if (typeof setCart === "function") {
      setCart((prev) => {
        const list = prev ?? [];
        const found = list.find((i) => i.id === p._id);
        if (found) {
          const updated = list.map((i) => (i.id === p._id ? { ...i, cantidad: (i.cantidad || 1) + 1 } : i));
          const newQty = (found.cantidad || 1) + 1;
          toast.success(`${p.name} agregado al carrito (cantidad: ${newQty})`, { toastId: `cart-${p._id}` });
          return updated;
        }
        toast.success(`${p.name} agregado al carrito`, { toastId: `cart-${p._id}` });
        return [...list, item];
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <section id="catalogo" className="py-5 container">
      <style>{`
        .product-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 255, 114, 0.15);
          border-color: rgba(0, 255, 114, 0.3);
        }
        .product-img-wrapper {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .product-img-wrapper img {
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-img-wrapper img {
          transform: scale(1.05);
        }
      `}</style>

      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold mb-3" style={{ color: "#fff", textShadow: "0 0 20px rgba(0, 247, 255, 0.5)" }}>
          Catálogo <span style={{ color: "var(--verde-neon)" }}>Gamer</span>
        </h2>
        <p className="lead text-white-50">Encuentra el mejor equipamiento para tu setup</p>
      </div>

      <div className="row mb-5">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <div className="position-relative">
            <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: "var(--azul-electrico)" }}></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control input-premium ps-5"
              placeholder="Buscar productos (ej: teclado, mouse, consola)..."
              style={{ height: "50px", fontSize: "1.1rem" }}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filtered.map((p) => (
          <div key={p._id} className="col-md-6 col-lg-4 d-flex align-items-stretch">
            <div className="product-card h-100 w-100 d-flex flex-column">
              <div className="product-img-wrapper ratio ratio-4x3 bg-dark">
                <ImageWithFallback
                  src={p.images?.[0] ? `/assets/imag/${p.images[0]}` : placeholder}
                  alt={p.name}
                  className="card-img-top object-fit-cover"
                  placeholder={placeholder}
                />
              </div>
              <div className="card-body d-flex flex-column p-4">
                <h5 className="card-title text-white fw-bold mb-2">{p.name}</h5>
                <p className="card-text flex-grow-1" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
                  {p.description}
                </p>
                <div className="mt-3 d-flex align-items-center justify-content-between gap-3">
                  <span className="display-6 fw-bold" style={{ color: "var(--verde-neon)", fontSize: "1.8rem" }}>
                    ${formatter.format(p.price)}
                  </span>
                  <button
                    className="btn-premium px-4 py-2"
                    onClick={() => handleAdd(p)}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-5">
          <div className="display-1 mb-3">🔍</div>
          <h3 className="text-white">No encontramos productos</h3>
          <p className="text-white-50">Intenta con otra búsqueda.</p>
        </div>
      )}
    </section>
  );
}