import { useEffect, useState } from "react";
import {
  api,
  DUMMY_BOOKINGS,
  DUMMY_CUSTOMERS,
  DUMMY_ROOMS,
} from "../services/api";
import type { Booking, Customer, Room } from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchAll() {
    try {
      setLoading(true);
      const [b, c, r] = await Promise.all([
        api<Booking[]>("GET", "/bookings"),
        api<Customer[]>("GET", "/customers"),
        api<Room[]>("GET", "/rooms"),
      ]);
      setBookings(b);
      setCustomers(c);
      setRooms(r);
      setUsingDummy(false);
    } catch {
      setBookings(DUMMY_BOOKINGS);
      setCustomers(DUMMY_CUSTOMERS);
      setRooms(DUMMY_ROOMS);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId || !roomId || !checkIn || !checkOut) return;

    try {
      setSubmitting(true);
      await api("POST", "/bookRoom", {
        customer_id: Number(customerId),
        room_id: Number(roomId),
        check_in: checkIn,
        check_out: checkOut,
      });
      setCustomerId("");
      setRoomId("");
      setCheckIn("");
      setCheckOut("");
      await fetchAll();
    } catch {
      // Offline — add locally
      const newBooking: Booking = {
        id: bookings.length + 1,
        customer_id: Number(customerId),
        room_id: Number(roomId),
        check_in: checkIn,
        check_out: checkOut,
        status: "Pending",
        total_price: 0,
      };
      setBookings((prev) => [...prev, newBooking]);
      setCustomerId("");
      setRoomId("");
      setCheckIn("");
      setCheckOut("");
    } finally {
      setSubmitting(false);
    }
  }

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading bookings…</p>
      </div>
    );
  }

  const availableRooms = rooms.filter(
    (r) => r.status?.toLowerCase() === "available"
  );

  return (
    <div className="dashboard">
      {usingDummy && (
        <div className="dummy-banner">
          ⚠ Backend offline — showing sample data
        </div>
      )}

      {/* Book a Room */}
      <div className="card">
        <p className="card-title">Book a Room</p>
        <form className="form-row" onSubmit={handleBook}>
          <select
            className="input"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name} (#{c.id})
              </option>
            ))}
          </select>

          <select
            className="input"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            <option value="">Select Room</option>
            {availableRooms.map((r) => (
              <option key={r.id} value={r.id}>
                Room {r.room_number ?? r.id} — {r.type}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
          <input
            type="date"
            className="input"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Booking…" : "Book Room"}
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <p className="card-title">
          All Bookings · <span style={{ color: "var(--text)" }}>{bookings.length}</span>
        </p>
        {bookings.length === 0 ? (
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
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>#{b.customer_id}</td>
                    <td>#{b.room_id}</td>
                    <td>{formatDate(b.check_in)}</td>
                    <td>{formatDate(b.check_out)}</td>
                    <td>{b.total_price ? `₹${b.total_price}` : "—"}</td>
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
