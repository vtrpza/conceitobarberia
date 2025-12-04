import { createClient, Client } from "@libsql/client";

// Conexão lazy com o banco de dados Turso
let _db: Client | null = null;

function getDb(): Client {
  if (!_db) {
    _db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return _db;
}

// ============ SERVICES ============

export interface DbService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export async function getServices(): Promise<DbService[]> {
  const result = await getDb().execute("SELECT * FROM services");
  return result.rows as unknown as DbService[];
}

export async function getServiceById(id: string): Promise<DbService | undefined> {
  const result = await getDb().execute({
    sql: "SELECT * FROM services WHERE id = ?",
    args: [id],
  });
  return result.rows[0] as unknown as DbService | undefined;
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

export async function getBarbers(): Promise<DbBarberPublic[]> {
  const db = getDb();
  const barbersResult = await db.execute(`
    SELECT id, name, phone, avatar, working_hours FROM barbers
  `);

  const barbers = barbersResult.rows as unknown as Omit<DbBarberPublic, "services">[];

  const barbersWithServices = await Promise.all(
    barbers.map(async (barber) => {
      const servicesResult = await db.execute({
        sql: "SELECT service_id FROM barber_services WHERE barber_id = ?",
        args: [barber.id],
      });

      return {
        ...barber,
        services: servicesResult.rows.map((s) => (s as unknown as { service_id: string }).service_id),
      };
    })
  );

  return barbersWithServices;
}

export async function getBarberById(id: string): Promise<DbBarberPublic | undefined> {
  const db = getDb();
  const barberResult = await db.execute({
    sql: "SELECT id, name, phone, avatar, working_hours FROM barbers WHERE id = ?",
    args: [id],
  });

  const barber = barberResult.rows[0] as unknown as Omit<DbBarberPublic, "services"> | undefined;

  if (!barber) return undefined;

  const servicesResult = await db.execute({
    sql: "SELECT service_id FROM barber_services WHERE barber_id = ?",
    args: [id],
  });

  return {
    ...barber,
    services: servicesResult.rows.map((s) => (s as unknown as { service_id: string }).service_id),
  };
}

export async function getBarberByPhone(phone: string): Promise<DbBarber | undefined> {
  const result = await getDb().execute({
    sql: "SELECT * FROM barbers WHERE phone = ?",
    args: [phone],
  });
  return result.rows[0] as unknown as DbBarber | undefined;
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

export async function getAppointments(): Promise<DbAppointment[]> {
  const result = await getDb().execute("SELECT * FROM appointments ORDER BY date, time");
  return result.rows as unknown as DbAppointment[];
}

export async function getAppointmentsByDate(date: string): Promise<DbAppointment[]> {
  const result = await getDb().execute({
    sql: `
      SELECT * FROM appointments
      WHERE date = ? AND status != 'cancelled'
      ORDER BY time
    `,
    args: [date],
  });
  return result.rows as unknown as DbAppointment[];
}

export async function getAppointmentsByBarberAndDate(
  barberId: string,
  date: string
): Promise<DbAppointment[]> {
  const result = await getDb().execute({
    sql: `
      SELECT * FROM appointments
      WHERE barber_id = ? AND date = ? AND status != 'cancelled'
      ORDER BY time
    `,
    args: [barberId, date],
  });
  return result.rows as unknown as DbAppointment[];
}

export async function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  barberId?: string
): Promise<DbAppointment[]> {
  const db = getDb();
  if (barberId) {
    const result = await db.execute({
      sql: `
        SELECT * FROM appointments
        WHERE date >= ? AND date <= ? AND barber_id = ?
        ORDER BY date, time
      `,
      args: [startDate, endDate, barberId],
    });
    return result.rows as unknown as DbAppointment[];
  }
  const result = await db.execute({
    sql: `
      SELECT * FROM appointments
      WHERE date >= ? AND date <= ?
      ORDER BY date, time
    `,
    args: [startDate, endDate],
  });
  return result.rows as unknown as DbAppointment[];
}

export async function createAppointment(data: {
  clientName: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}): Promise<DbAppointment> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await getDb().execute({
    sql: `
      INSERT INTO appointments (id, client_name, client_phone, barber_id, service_id, date, time, status, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `,
    args: [
      id,
      data.clientName,
      data.clientPhone,
      data.barberId,
      data.serviceId,
      data.date,
      data.time,
      data.notes || null,
      createdAt,
    ],
  });

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

export async function updateAppointmentStatus(
  id: string,
  status: DbAppointment["status"]
): Promise<boolean> {
  const result = await getDb().execute({
    sql: "UPDATE appointments SET status = ? WHERE id = ?",
    args: [status, id],
  });

  return result.rowsAffected > 0;
}

export async function getAppointmentById(id: string): Promise<DbAppointment | undefined> {
  const result = await getDb().execute({
    sql: "SELECT * FROM appointments WHERE id = ?",
    args: [id],
  });
  return result.rows[0] as unknown as DbAppointment | undefined;
}

// ============ UTILS ============

export async function checkSlotAvailable(
  barberId: string,
  date: string,
  time: string
): Promise<boolean> {
  const result = await getDb().execute({
    sql: `
      SELECT id FROM appointments
      WHERE barber_id = ? AND date = ? AND time = ? AND status != 'cancelled'
      LIMIT 1
    `,
    args: [barberId, date, time],
  });

  return result.rows.length === 0;
}

export { getDb as db };
