import Database from "better-sqlite3";
import path from "path";

// Conexão com o banco de dados
const dbPath = path.join(process.cwd(), "data", "barbershop.db");
const db = new Database(dbPath);

// Configurações de performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ============ SERVICES ============

export interface DbService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export function getServices(): DbService[] {
  return db.prepare("SELECT * FROM services").all() as DbService[];
}

export function getServiceById(id: string): DbService | undefined {
  return db.prepare("SELECT * FROM services WHERE id = ?").get(id) as DbService | undefined;
}

// ============ BARBERS ============

export interface DbBarber {
  id: string;
  name: string;
  phone: string;
  avatar: string | null;
  password_hash: string;
  working_hours: string; // JSON string
}

export interface DbBarberPublic {
  id: string;
  name: string;
  phone: string;
  avatar: string | null;
  working_hours: string;
  services: string[]; // IDs dos serviços
}

export function getBarbers(): DbBarberPublic[] {
  const barbers = db.prepare(`
    SELECT id, name, phone, avatar, working_hours FROM barbers
  `).all() as Omit<DbBarberPublic, "services">[];

  return barbers.map((barber) => {
    const services = db
      .prepare("SELECT service_id FROM barber_services WHERE barber_id = ?")
      .all(barber.id) as { service_id: string }[];

    return {
      ...barber,
      services: services.map((s) => s.service_id),
    };
  });
}

export function getBarberById(id: string): DbBarberPublic | undefined {
  const barber = db.prepare(`
    SELECT id, name, phone, avatar, working_hours FROM barbers WHERE id = ?
  `).get(id) as Omit<DbBarberPublic, "services"> | undefined;

  if (!barber) return undefined;

  const services = db
    .prepare("SELECT service_id FROM barber_services WHERE barber_id = ?")
    .all(id) as { service_id: string }[];

  return {
    ...barber,
    services: services.map((s) => s.service_id),
  };
}

export function getBarberByPhone(phone: string): DbBarber | undefined {
  return db.prepare("SELECT * FROM barbers WHERE phone = ?").get(phone) as DbBarber | undefined;
}

// ============ APPOINTMENTS ============

export interface DbAppointment {
  id: string;
  client_name: string;
  client_phone: string;
  barber_id: string;
  service_id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  created_at: string;
}

export function getAppointments(): DbAppointment[] {
  return db.prepare("SELECT * FROM appointments ORDER BY date, time").all() as DbAppointment[];
}

export function getAppointmentsByDate(date: string): DbAppointment[] {
  return db.prepare(`
    SELECT * FROM appointments
    WHERE date = ? AND status != 'cancelled'
    ORDER BY time
  `).all(date) as DbAppointment[];
}

export function getAppointmentsByBarberAndDate(
  barberId: string,
  date: string
): DbAppointment[] {
  return db.prepare(`
    SELECT * FROM appointments
    WHERE barber_id = ? AND date = ? AND status != 'cancelled'
    ORDER BY time
  `).all(barberId, date) as DbAppointment[];
}

export function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  barberId?: string
): DbAppointment[] {
  if (barberId) {
    return db.prepare(`
      SELECT * FROM appointments
      WHERE date >= ? AND date <= ? AND barber_id = ?
      ORDER BY date, time
    `).all(startDate, endDate, barberId) as DbAppointment[];
  }
  return db.prepare(`
    SELECT * FROM appointments
    WHERE date >= ? AND date <= ?
    ORDER BY date, time
  `).all(startDate, endDate) as DbAppointment[];
}

export function createAppointment(data: {
  clientName: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}): DbAppointment {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO appointments (id, client_name, client_phone, barber_id, service_id, date, time, status, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `).run(
    id,
    data.clientName,
    data.clientPhone,
    data.barberId,
    data.serviceId,
    data.date,
    data.time,
    data.notes || null,
    createdAt
  );

  return {
    id,
    client_name: data.clientName,
    client_phone: data.clientPhone,
    barber_id: data.barberId,
    service_id: data.serviceId,
    date: data.date,
    time: data.time,
    status: "pending",
    notes: data.notes || null,
    created_at: createdAt,
  };
}

export function updateAppointmentStatus(
  id: string,
  status: DbAppointment["status"]
): boolean {
  const result = db.prepare(`
    UPDATE appointments SET status = ? WHERE id = ?
  `).run(status, id);

  return result.changes > 0;
}

export function getAppointmentById(id: string): DbAppointment | undefined {
  return db.prepare("SELECT * FROM appointments WHERE id = ?").get(id) as DbAppointment | undefined;
}

// ============ UTILS ============

export function checkSlotAvailable(
  barberId: string,
  date: string,
  time: string
): boolean {
  const existing = db.prepare(`
    SELECT id FROM appointments
    WHERE barber_id = ? AND date = ? AND time = ? AND status != 'cancelled'
    LIMIT 1
  `).get(barberId, date, time);

  return !existing;
}

export { db };
