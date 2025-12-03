import React from "react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/56912345678" // Reemplaza con el número real
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat en WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}