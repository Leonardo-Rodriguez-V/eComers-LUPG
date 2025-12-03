import React from "react";
import { toast } from "react-toastify";

export default function CartModal({ show, handleClose, cart = [], setCart, user }) {
  if (!show) return null;
  const formatter = new Intl.NumberFormat("es-CL");

  const quitarDelCarrito = (id) => {
    setCart?.((prev = []) => {
      const next = prev.filter((item) => item.id !== id);
      toast.info("Producto eliminado del carrito", { toastId: `removed-${id}` });
      return next;
    });
  };

  const vaciarCarrito = () => {
    setCart?.([]);
    toast.info("Carrito vaciado", { toastId: "cart-empty" });
  };

  const total = cart.reduce((sum, it) => sum + (it.precio * (it.cantidad || 1)), 0);
  const descuento = user?.email?.endsWith?.("@duoc.cl") ? Math.round(total * 0.2) : 0;

  const finalizarCompra = () => {
    if (!cart || cart.length === 0) {
      toast.warning("El carrito está vacío", { toastId: "checkout-empty" });
      return;
    }

    // Mostrar resumen y confirmar finalización (simulación)
    const totalConDescuento = total - descuento;
    toast.success(
      `Compra finalizada. Total: $${formatter.format(total)}${descuento > 0 ? ` (-$${formatter.format(descuento)} descuento) = $${formatter.format(totalConDescuento) }` : ""}`,
      { toastId: "checkout-success", autoClose: 4500 }
    );

    vaciarCarrito();
    handleClose?.();
  };

  return (
    <div className="modal" style={{ display: "block", background: "rgba(0,0,0,0.6)" }} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">Carrito</h5>
            <button className="btn-close btn-close-white" onClick={handleClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            {(!cart || cart.length === 0) ? (
              <p>Carrito vacío</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-2">
                  <img
                    src={item.img || "/assets/imag/placeholder.png"}
                    width="50"
                    className="me-2 rounded"
                    alt={item.nombre}
                    onError={(e) => (e.currentTarget.src = "/assets/imag/placeholder.png")}
                  />
                  <span className="flex-grow-1">
                    {item.nombre} x{item.cantidad || 1}
                  </span>
                  <span className="me-2">${formatter.format(item.precio * (item.cantidad || 1))}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => quitarDelCarrito(item.id)}>
                    Eliminar
                  </button>
                </div>
              ))
            )}
            <h5>Total: ${formatter.format(total)}</h5>
            {descuento > 0 && <p style={{ color: "var(--verde-neon)" }}>Descuento Duoc: -${formatter.format(descuento)}</p>}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
            <button className="btn btn-danger" onClick={vaciarCarrito}>Vaciar</button>
            <button className="btn btn-success" onClick={finalizarCompra}>Finalizar</button>
          </div>
        </div>
      </div>
    </div>
  );
}