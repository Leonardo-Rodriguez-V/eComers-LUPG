import React from "react";

/*
  CartDrawer
  Props:
  - visible (boolean)
  - onClose (fn)
  - cart (array)
  - updateQty(id, qty) (fn)
  - removeFromCart(id) (fn)
  - clearCart() (fn)
  - onCheckout() (optional)
*/

export default function CartDrawer({ visible, onClose, cart = [], updateQty, removeFromCart, clearCart, onCheckout }) {
  const formatter = new Intl.NumberFormat("es-CL");

  const subtotal = cart.reduce((s, i) => s + (i.precio || 0) * (i.cantidad || 1), 0);
  const shipping = subtotal > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1050;
          display: ${visible ? "block" : "none"};
        }
        .cart-drawer {
          position: fixed;
          right: 0;
          top: 0;
          height: 100vh;
          width: min(420px, 92%);
          background: #0f1720;
          color: #fff;
          z-index: 1060;
          transform: translateX(${visible ? "0" : "110%"});
          transition: transform .28s ease;
          box-shadow: -24px 0 60px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
        }
        .cart-header { padding: 18px; border-bottom: 1px solid rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .cart-body { padding: 12px; overflow:auto; flex:1; }
        .cart-footer { padding: 16px; border-top: 1px solid rgba(255,255,255,0.04); background: linear-gradient(180deg, rgba(0,0,0,0.02), transparent); }
        .cart-item { display:flex; gap:12px; align-items:center; padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.03); }
        .cart-item img { width:72px; height:64px; object-fit:cover; border-radius:8px; background:#111; }
        .qty-control { display:flex; gap:8px; align-items:center; }
        .btn-small { padding:6px 10px; border-radius:8px; background:rgba(255,255,255,0.06); color:#fff; border:none; }
        .btn-danger-small { padding:6px 10px; border-radius:8px; background:transparent; color:#ff6b6b; border:1px solid rgba(255,107,107,0.12); }
        .muted { color: rgba(255,255,255,0.6); font-size:0.95rem; }
      `}</style>

      <div className="cart-overlay" onClick={onClose} aria-hidden={!visible} />

      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-hidden={!visible}>
        <div className="cart-header">
          <div>
            <strong>Tu carrito</strong>
            <div className="muted" style={{ fontSize: 12 }}>{cart.length} artículo(s)</div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="btn-small" onClick={() => { clearCart(); }} title="Vaciar carrito">Vaciar</button>
            <button className="btn-small" onClick={onClose} aria-label="Cerrar carrito">Cerrar ✕</button>
          </div>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.7)" }}>
              Tu carrito está vacío.
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.img || "/assets/imag/placeholder.png"} alt={item.nombre} onError={(e) => (e.currentTarget.src = "/assets/imag/placeholder.png")} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.nombre}</div>
                      <div className="muted" style={{ fontSize: 13 }}>{item.category || ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>${formatter.format((item.precio || 0))}</div>
                      <div className="muted" style={{ fontSize: 12 }}>${formatter.format((item.precio || 0) * (item.cantidad || 1))}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="qty-control" role="group" aria-label="Cantidad">
                      <button className="btn-small" onClick={() => updateQty(item.id, Math.max(1, (item.cantidad || 1) - 1))}>-</button>
                      <div style={{ minWidth: 34, textAlign: "center" }}>{item.cantidad || 1}</div>
                      <button className="btn-small" onClick={() => updateQty(item.id, (item.cantidad || 1) + 1)}>+</button>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-danger-small" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="muted">Subtotal</div>
            <div>${formatter.format(subtotal)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="muted">Envío</div>
            <div>${formatter.format(shipping)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 12 }}>
            <div>Total</div>
            <div>${formatter.format(total)}</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                if (typeof onCheckout === "function") onCheckout(cart);
                else alert("Checkout simulado. Implementa un flujo real para proceder al pago.");
              }}
              disabled={cart.length === 0}
            >
              Ir a pagar
            </button>

            <button className="btn btn-outline-light" style={{ flex: 1 }} onClick={onClose}>
              Seguir comprando
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}