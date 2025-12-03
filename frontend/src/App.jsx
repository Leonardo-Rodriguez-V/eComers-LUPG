import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import { createOrder } from "./services/checkout";
import { toast } from "react-toastify";
import WhatsAppButton from "./components/WhatsAppButton";

// Carga diferida de páginas para mejorar el rendimiento del primer paint
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const Contacto = lazy(() => import("./components/Contacto"));
const Eventos = lazy(() => import("./pages/Eventos"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));

/* App integrado con carrito, rutas y Footer */
const CART_KEY = "levelup_cart_v1";

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error parsing cart from localStorage", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage", err);
    }
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const list = prev ?? [];
      const found = list.find((i) => i.id === item.id);
      if (found) {
        return list.map((i) => (i.id === item.id ? { ...i, cantidad: (i.cantidad || 1) + (item.cantidad || 1) } : i));
      }
      return [...list, { ...item, cantidad: item.cantidad || 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad: qty } : i)).filter(i => i.cantidad > 0));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  // control para drawer
  const [showCart, setShowCart] = useState(false);

  // logout wrapper that also clears cart
  const logoutAndClear = () => {
    if (auth?.logout) auth.logout();
    clearCart();
    navigate("/");
  };

  return (
    <>
      <Navbar onShowCart={() => setShowCart(true)} logout={logoutAndClear} />
      <ToastContainer />
      <Suspense fallback={<div className="text-center py-5">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<HomePage setCart={setCart} addToCart={addToCart} />} />
          <Route path="/catalogo" element={<CatalogPage addToCart={addToCart} />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/mis-ordenes" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          {/* otras rutas si necesitas */}
        </Routes>
      </Suspense>

      <CartDrawer
        visible={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        onCheckout={() => {
          if (!auth.user) {
            toast.info("Debes iniciar sesión para comprar");
            navigate("/login");
            setShowCart(false);
            return;
          }
          setShowCart(false);
          navigate("/checkout");
        }}
      />

      <WhatsAppButton />

      {/* Footer siempre visible */}
      <Footer />
    </>
  );
}