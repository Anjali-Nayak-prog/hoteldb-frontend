const API_BASE = "http://localhost:3000";

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface Room {
  id: number;
  room_number?: number;
  type: string;
  price: number;
  status: string;
}

export interface Booking {
  id: number;
  customer_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  status: string;
  total_price?: number;
}

export async function api<T = unknown>(
  method: string,
  path: string,
  body: unknown = null
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(API_BASE + path, options);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// ===== DUMMY DATA =====

export const DUMMY_CUSTOMERS: Customer[] = [
  { id: 1, first_name: "Anjali", last_name: "Nayak", email: "anjali@mail.com", phone: "9876543210" },
  { id: 2, first_name: "Rahul", last_name: "Sharma", email: "rahul@mail.com", phone: "9123456780" },
  { id: 3, first_name: "Priya", last_name: "Verma", email: "priya@mail.com", phone: "9988776655" },
  { id: 4, first_name: "Arjun", last_name: "Patel", email: "arjun@mail.com", phone: "9871234560" },
  { id: 5, first_name: "Sneha", last_name: "Gupta", email: "sneha@mail.com", phone: "9765432100" },
];

export const DUMMY_ROOMS: Room[] = [
  { id: 101, type: "Deluxe", price: 2500, status: "Available" },
  { id: 102, type: "Suite", price: 4000, status: "Occupied" },
  { id: 103, type: "Standard", price: 1500, status: "Available" },
  { id: 104, type: "Deluxe", price: 2500, status: "Maintenance" },
  { id: 105, type: "Suite", price: 4500, status: "Available" },
  { id: 106, type: "Standard", price: 1200, status: "Occupied" },
];

export const DUMMY_BOOKINGS: Booking[] = [
  { id: 1, customer_id: 1, room_id: 101, check_in: "2026-04-20", check_out: "2026-04-22", status: "Confirmed", total_price: 5000 },
  { id: 2, customer_id: 2, room_id: 102, check_in: "2026-04-18", check_out: "2026-04-21", status: "Confirmed", total_price: 12000 },
  { id: 3, customer_id: 3, room_id: 103, check_in: "2026-04-22", check_out: "2026-04-25", status: "Pending", total_price: 4500 },
  { id: 4, customer_id: 4, room_id: 106, check_in: "2026-04-15", check_out: "2026-04-17", status: "Cancelled", total_price: 2400 },
  { id: 5, customer_id: 5, room_id: 105, check_in: "2026-04-23", check_out: "2026-04-26", status: "Confirmed", total_price: 13500 },
];
