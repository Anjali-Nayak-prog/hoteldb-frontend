import { useEffect, useState } from "react";
import { api, DUMMY_ROOMS } from "../services/api";
import type { Room } from "../services/api";

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const data = await api<Room[]>("GET", "/rooms");
        setRooms(data);
        setUsingDummy(false);
      } catch {
        setRooms(DUMMY_ROOMS);
        setUsingDummy(true);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  function statusBadge(status: string) {
    switch (status?.toLowerCase()) {
      case "available": return "badge-confirmed";
      case "occupied": return "badge-cancelled";
      case "maintenance": return "badge-pending";
      default: return "";
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading rooms…</p>
      </div>
    );
  }

  const available = rooms.filter((r) => r.status?.toLowerCase() === "available").length;
  const occupied = rooms.filter((r) => r.status?.toLowerCase() === "occupied").length;

  return (
    <div className="dashboard">
      {usingDummy && (
        <div className="dummy-banner">
          ⚠ Backend offline — showing sample data
        </div>
      )}

      {/* Room Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-accent" style={{ background: "var(--accent2)" }} />
          <p className="stat-label">Total Rooms</p>
          <p className="stat-value">{rooms.length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-accent" style={{ background: "var(--success)" }} />
          <p className="stat-label">Available</p>
          <p className="stat-value">{available}</p>
        </div>
        <div className="stat-card">
          <div className="stat-accent" style={{ background: "var(--danger)" }} />
          <p className="stat-label">Occupied</p>
          <p className="stat-value">{occupied}</p>
        </div>
      </div>

      {/* Room Grid */}
      <div className="rooms-grid">
        {rooms.map((r) => (
          <div className="room-card" key={r.id}>
            <p className="room-number">Room {r.room_number ?? r.id}</p>
            <p className="room-type">{r.type}</p>
            <p className="room-price">₹{r.price}/night</p>
            <span className={`badge ${statusBadge(r.status)}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
