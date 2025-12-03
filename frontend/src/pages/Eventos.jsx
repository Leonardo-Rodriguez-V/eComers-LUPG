import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";
import api from "../services/api";
import { mockEvents } from "../data/mockData";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente para centrar el mapa
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapCenter, setMapCenter] = useState([-33.4489, -70.6693]); // Santiago default
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Fallback to mock data
      setEvents(mockEvents);
      toast.info("Mostrando eventos de demostración");
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no soportada por tu navegador");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);
        setZoom(14);
        toast.success("Ubicación encontrada");
      },
      () => {
        toast.error("No se pudo obtener tu ubicación");
      }
    );
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setMapCenter([event.lat, event.lng]);
    setZoom(15);
    // Scroll to map
    document.getElementById("mapa-eventos")?.scrollIntoView({ behavior: "smooth" });
  };

  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="fade-in pt-5 mt-5">
      {/* Hero Eventos */}
      <section className="text-white text-center py-5 position-relative" style={{ background: "linear-gradient(to bottom, #020024, #090979)" }}>
        <div className="container position-relative z-1">
          <h1 className="display-3 fw-bold mb-3 text-shadow-neon">Eventos & Torneos</h1>
          <p className="lead mx-auto" style={{ maxWidth: "700px", color: "#e0e0e0" }}>
            Participa en nuestros torneos presenciales, meetups y lanzamientos exclusivos.
            ¡La comunidad gamer te espera!
          </p>
        </div>
      </section>

      <div className="container py-5">
        {/* Lista de Eventos */}
        <div className="row g-4 mb-5">
          {loading ? (
            <div className="text-center text-white">Cargando eventos...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-white">No hay eventos programados por ahora.</div>
          ) : (
            events.map((event) => (
              <div className="col-md-4" key={event._id}>
                <div className="card h-100 glass-panel border-0 shadow-sm hover-scale">
                  <div className="position-relative">
                    <img
                      src={event.image}
                      className="card-img-top"
                      alt={event.title}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => (e.currentTarget.src = "/assets/imag/placeholder.png")}
                    />
                    <div className="position-absolute top-0 end-0 p-2">
                      <span className="badge bg-primary">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-white fw-bold">{event.title}</h5>
                    <p className="card-text text-white-50 small mb-2">
                      <i className="fas fa-map-marker-alt me-1 text-danger"></i> {event.location}
                    </p>
                    <p className="card-text text-white-50 flex-grow-1">{event.excerpt}</p>
                    <div className="mt-3">
                      {event.tags && event.tags.map((tag, idx) => (
                        <span key={idx} className="badge bg-dark border border-secondary me-1">{tag}</span>
                      ))}
                    </div>
                    <button
                      className="btn btn-outline-light w-100 mt-3"
                      onClick={() => handleEventClick(event)}
                    >
                      Ver Detalles y Mapa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sección Mapa */}
        <div id="mapa-eventos" className="card shadow-lg border-0 overflow-hidden mb-5">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0"><i className="fas fa-map-marked-alt me-2 text-primary"></i> Mapa de Eventos</h4>
            <button className="btn btn-sm btn-primary" onClick={handleLocate}>
              <i className="fas fa-crosshairs me-1"></i> Mi Ubicación
            </button>
          </div>
          <div style={{ height: "500px", width: "100%" }}>
            <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <ChangeView center={mapCenter} zoom={zoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {events.map((event) => (
                <Marker key={event._id} position={[event.lat, event.lng]}>
                  <Popup>
                    <div className="text-center">
                      <h6 className="fw-bold mb-1">{event.title}</h6>
                      <p className="mb-1 small">{event.location}</p>
                      <button
                        className="btn btn-sm btn-primary mt-1"
                        onClick={() => setSelectedEvent(event)}
                      >
                        Ver Info
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {selectedEvent && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title">{selectedEvent.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="img-fluid rounded shadow"
                      onError={(e) => (e.currentTarget.src = "/assets/imag/placeholder.png")}
                    />
                  </div>
                  <div className="col-md-6">
                    <p className="lead text-primary mb-2">
                      {new Date(selectedEvent.date).toLocaleDateString()} - {new Date(selectedEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="mb-3"><i className="fas fa-map-marker-alt text-danger me-2"></i> {selectedEvent.location}</p>
                    <hr className="border-secondary" />
                    <p>{selectedEvent.details}</p>
                    <div className="mt-4">
                      <button className="btn btn-success w-100" onClick={() => toast.success("¡Inscripción simulada exitosa!")}>
                        Confirmar Asistencia
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}