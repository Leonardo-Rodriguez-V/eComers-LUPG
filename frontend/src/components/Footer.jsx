import React, { useState } from "react";
import { toast } from "react-toastify";

/* Footer.jsx — pega en src/components/Footer.jsx */
export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const logoSrc = "/assets/imag/logoNew.png";
  const placeholder = "/assets/imag/placeholder.png";

  const isValidEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(value).toLowerCase());
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Ingresa un correo para suscribirte", { toastId: "nf-empty" });
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Ingresa un correo válido", { toastId: "nf-invalid" });
      return;
    }

    setSending(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      toast.success("Suscripción confirmada. Gracias 😊", { toastId: "nf-success" });
      setEmail("");
    } catch (err) {
      toast.error("No se pudo suscribir. Intenta más tarde.", { toastId: "nf-fail" });
    } finally {
      setSending(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const header = document.querySelector("header, main, h1");
    if (header instanceof HTMLElement) header.focus({ preventScroll: true });
  };

  return (
    <footer aria-labelledby="footerTitle" style={{ marginTop: 40 }}>
      <style>{`
        .site-footer { background: linear-gradient(180deg, #07090b, #07121a); border-top: 1px solid rgba(255,255,255,0.03); color: #dbeafe; padding: 28px 16px; }
        .site-footer .footer-inner { display: flex; gap: 24px; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; max-width: 1200px; margin: 0 auto; }
        .footer-brand { display:flex; align-items:center; gap:12px; min-width: 220px; }
        .footer-brand img { height: 44px; width: auto; display:block; }
        .footer-links a { color: #cfeffd; text-decoration: none; margin-right: 12px; }
        .footer-links a:hover { color: #00d2ff; text-decoration: underline; }
        .socials { display:flex; gap:8px; align-items:center; margin-top:6px; }
        .socials a { display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; background: rgba(255,255,255,0.03); color:#9fe9ff; text-decoration:none; }
        .newsletter { min-width: 260px; }
        .newsletter form { display:flex; gap:8px; align-items:center; }
        .newsletter .form-control { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #fff; padding: 10px 12px; border-radius: 8px; }
        .newsletter .btn-sub { padding: 10px 14px; border-radius:8px; border: none; background: linear-gradient(90deg,#0ebf3b,#00ff72); color:#001b00; font-weight:700; box-shadow: 0 8px 20px rgba(0,255,114,0.12); }
        .footer-bottom { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:18px; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.03); padding-top:16px; color: rgba(255,255,255,0.65); }
        .back-to-top { background: transparent; border: 1px solid rgba(255,255,255,0.04); padding:8px 10px; border-radius:8px; color:#cfeffd; cursor:pointer; }
        @media (max-width: 780px) { .site-footer .footer-inner { flex-direction: column; align-items: stretch; } .newsletter form { flex-direction: column; align-items: stretch; } .newsletter .btn-sub { width: 100%; } }
      `}</style>

      <div className="site-footer" role="contentinfo">
        <div className="footer-inner container">
          <div className="footer-brand" aria-hidden="false">
            <img
              src={logoSrc}
              alt="Level UP Gamer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }}
            />
            <div>
              <div style={{ fontWeight: 700, color: "#ffffff" }}>Level UP Gamer</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Gaming gear • Comunidad • Eventos</div>
            </div>
          </div>

          <div className="footer-links" aria-label="Enlaces legales">
            <nav>
              <a href="/privacidad" className="me-2" rel="noopener noreferrer">Privacidad</a>
              <a href="#contacto" className="me-2">Contacto</a>
              <a href="/terminos" rel="noopener noreferrer">Términos</a>
            </nav>

            <div className="socials" aria-label="Redes sociales">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
              <a href="https://www.twitch.tv" target="_blank" rel="noopener noreferrer" aria-label="Twitch"><i className="fab fa-twitch" aria-hidden="true"></i></a>
            </div>
          </div>

          <div className="newsletter" aria-label="Suscribirse al newsletter">
            <form onSubmit={handleSubscribe}>
              <label htmlFor="footer-email" className="visually-hidden">Correo electrónico</label>
              <input
                id="footer-email"
                className="form-control"
                type="email"
                placeholder="Tu correo para novedades"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Correo electrónico para suscribirse"
                disabled={sending}
              />
              <div style={{ height: 8 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="btn-sub" disabled={sending} aria-disabled={sending}>
                  {sending ? "Enviando..." : "Suscribirme"}
                </button>
                <button type="button" className="back-to-top" onClick={scrollToTop} aria-label="Volver arriba">↑</button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-bottom container">
          <div>&copy; {year} Level UP Gamer. Todos los derechos reservados.</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <small style={{ color: "rgba(255,255,255,0.55)" }}>Hecho con ❤️ para la comunidad</small>
            <button className="back-to-top" onClick={scrollToTop} aria-label="Volver arriba">Volver arriba</button>
          </div>
        </div>
      </div>
    </footer>
  );
}