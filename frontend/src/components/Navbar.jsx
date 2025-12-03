import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Navbar mejorado:
  - Usa AuthContext (useAuth) para obtener usuario y roles.
  - Muestra avatar/initials cuando el usuario está autenticado.
  - Menú desplegable con "Mi perfil" y "Salir" cuando hay usuario.
  - Muestra enlace a /admin solo si el usuario tiene role "admin".
  - Sigue soportando los handlers pasados por props (onShowLogin, onShowRegister, onShowProfile) para compatibilidad.
  - Navegación inteligente: rutas dedicadas vs secciones en Home.
*/

export default function Navbar({ onShowCart, onShowLogin, onShowRegister, onShowProfile, user: userProp, logout: logoutProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth(); // requiere que envuelvas <App /> con <AuthProvider>

  // Preferir datos desde props (compatibilidad) y caer a contexto si no se pasan.
  const user = userProp ?? auth?.user ?? null;
  const logout = logoutProp ?? auth?.logout ?? (() => { });

  // Mapear secciones/paths
  const routeFor = {
    catalogo: "/catalogo",
    promociones: "/promociones",
    eventos: "/eventos",
    blog: "/", // sección en home
    contacto: "/", // Ahora apunta a home para hacer scroll
    "origen-impacto": "/", // sección en home
  };

  const navigateTo = (key, scrollId) => {
    const target = routeFor[key] ?? "/";

    if (target === "/" && scrollId) {
      if (location.pathname === "/") {
        const el = document.getElementById(scrollId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
      navigate("/", { replace: false });
      setTimeout(() => {
        const el = document.getElementById(scrollId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 220);
      return;
    }

    navigate(target);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  const avatarSrc = user?.avatar || null;
  const isAdmin = typeof auth?.hasRole === "function" ? auth.hasRole("admin") : user?.role === "admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-sticky">
      <div className="container">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img
            src="/assets/imag/logoNew.png"
            alt="logo"
            width="48"
            className="me-3"
            onError={(e) => (e.currentTarget.src = "/assets/imag/placeholder.png")}
          />
          <span className="navbar-brand" style={{ cursor: "pointer", userSelect: "none" }}>LEVEL UP GAMER</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navCollapse" aria-controls="navCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-4">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link px-3 py-2 text-white fw-medium"
                onClick={() => navigateTo("catalogo")}
                style={{ transition: "all 0.3s ease" }}
              >
                Catálogo
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link btn btn-link px-3 py-2 text-white fw-medium"
                onClick={() => navigateTo("eventos")}
              >
                Eventos
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link btn btn-link px-3 py-2 text-white fw-medium"
                onClick={() => navigateTo("blog", "blog")}
              >
                Blog
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link btn btn-link px-3 py-2 text-white fw-medium"
                onClick={() => navigateTo("contacto", "contacto")}
              >
                Contacto
              </button>
            </li>

            {/* Mostrar enlace a admin si el usuario es admin */}
            {isAdmin && (
              <li className="nav-item">
                <Link to="/admin" className="nav-link px-3 py-2 text-white fw-medium">Admin</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            <button className="btn btn-primary me-2" onClick={() => onShowCart?.()} aria-label="Carrito">
              <i className="fas fa-shopping-cart" />
            </button>

            {user ? (
              /* Usuario autenticado: avatar + dropdown unificado */
              <div className="dropdown me-2">
                <button
                  className="btn btn-link text-decoration-none d-flex align-items-center gap-2 text-white dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ padding: 0 }}
                >
                  {/* Avatar circular */}
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid #0ebf3b" }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#0ebf3b,#00ff72)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#001b00",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        border: "2px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 0 10px rgba(14, 191, 59, 0.3)"
                      }}
                    >
                      {getInitials(user.nombre || user.email)}
                    </div>
                  )}
                </button>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow-lg border-0" aria-labelledby="userDropdown" style={{ background: "rgba(15, 23, 32, 0.95)", backdropFilter: "blur(10px)" }}>
                  <li>
                    <div className="px-3 py-2 border-bottom border-secondary mb-2">
                      <div className="fw-bold text-white">{user.nombre || "Usuario"}</div>
                      <div className="small text-white-50 text-truncate" style={{ maxWidth: "150px" }}>{user.email}</div>
                    </div>
                  </li>
                  <li>
                    <button className="dropdown-item text-white" onClick={() => onShowProfile?.() || navigate("/perfil")}>
                      <i className="fas fa-user-circle me-2 text-primary"></i> Mi Perfil
                    </button>
                  </li>
                  <li><hr className="dropdown-divider bg-secondary" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        logout?.();
                        navigate("/");
                      }}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                {/* No autenticado: mostrar botones de login/registro */}
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => {
                    if (typeof onShowLogin === "function") onShowLogin();
                    else navigate("/login");
                  }}
                >
                  Iniciar Sesión
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    if (typeof onShowRegister === "function") onShowRegister();
                    else navigate("/register");
                  }}
                >
                  Registro
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}