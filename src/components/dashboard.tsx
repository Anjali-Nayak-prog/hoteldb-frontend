import { useEffect, useState } from "react";
import {
  api,
  DUMMY_CUSTOMERS,
  DUMMY_ROOMS,
  DUMMY_BOOKINGS,
} from "../services/api";
import type { Customer, Room, Booking } from "../services/api";

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const [c, r, b] = await Promise.all([
          api<Customer[]>("GET", "/customers"),
          api<Room[]>("GET", "/rooms"),
          api<Booking[]>("GET", "/bookings"),
        ]);
        setCustomers(c);
        setRooms(r);
        setBookings(b);
        setUsingDummy(false);
      } catch {
        setCustomers(DUMMY_CUSTOMERS);
        setRooms(DUMMY_ROOMS);
        setBookings(DUMMY_BOOKINGS);
        setUsingDummy(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading dashboard…</p>
      </div>
    );
  }

  const activeBookings = bookings.filter(
    (b) => b.status?.toLowerCase() === "confirmed"
  ).length;

  const availableRooms = rooms.filter(
    (r) => r.status?.toLowerCase() === "available"
  ).length;

  const recentBookings = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);

  const stats = [
    { label: "Total Customers", value: customers.length, accent: "var(--accent)" },
    { label: "Total Rooms", value: rooms.length, accent: "var(--accent2)" },
    { label: "Active Bookings", value: activeBookings, accent: "var(--success)" },
    { label: "Available Rooms", value: availableRooms, accent: "var(--success)" },
  ];

  function badgeClass(status: string) {
    switch (status?.toLowerCase()) {
      case "confirmed": return "badge-confirmed";
      case "pending": return "badge-pending";
      case "cancelled": return "badge-cancelled";
      default: return "";
    }
  }

  function formatDate(d: string) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }

  return (
    <div className="dashboard">
      {usingDummy && (
        <div className="dummy-banner">
          ⚠ Backend offline — showing sample data
        </div>
      )}

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-accent" style={{ background: s.accent }} />
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">Recent Bookings</p>
        {recentBookings.length === 0 ? (
          <p className="empty-state">No bookings available.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer ID</th>
                  <th>Room ID</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>#{b.customer_id}</td>
                    <td>#{b.room_id}</td>
                    <td>{formatDate(b.check_in)}</td>
                    <td>{formatDate(b.check_out)}</td>
                    <td>
                      <span className={`badge ${badgeClass(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
