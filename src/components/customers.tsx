import { useEffect, useState } from "react";
import { api, DUMMY_CUSTOMERS } from "../services/api";
import type { Customer } from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);

  // Add customer form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const data = await api<Customer[]>("GET", "/customers");
      setCustomers(data);
      setUsingDummy(false);
    } catch {
      setCustomers(DUMMY_CUSTOMERS);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) return;

    try {
      setAdding(true);
      await api("POST", "/addCustomer", {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      await fetchCustomers();
    } catch {
      // Offline — add to local state
      const newCustomer: Customer = {
        id: customers.length + 1,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading customers…</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {usingDummy && (
        <div className="dummy-banner">
          ⚠ Backend offline — showing sample data
        </div>
      )}

      {/* Add Customer Form */}
      <div className="card">
        <p className="card-title">Add New Customer</p>
        <form className="form-row" onSubmit={handleAdd}>
          <input
            type="text"
            className="input"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className="input"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={adding}>
            {adding ? "Adding…" : "Add Customer"}
          </button>
        </form>
      </div>

      {/* Customer Table */}
      <div className="card">
        <p className="card-title">
          All Customers · <span style={{ color: "var(--text)" }}>{customers.length}</span>
        </p>
        {customers.length === 0 ? (
          <p className="empty-state">No customers available.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>{c.first_name} {c.last_name}</td>
                    <td>{c.email || "—"}</td>
                    <td>{c.phone || "—"}</td>
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
