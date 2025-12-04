import { createClient } from "@libsql/client";

// Conectar ao banco de dados Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function setup() {
  console.log("Configurando banco de dados Turso...");

  // Criar tabelas (apenas se não existirem)
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      duration INTEGER NOT NULL,
      price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS barbers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      avatar TEXT,
      password_hash TEXT NOT NULL,
      working_hours TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS barber_services (
      barber_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      PRIMARY KEY (barber_id, service_id),
      FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      barber_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (barber_id) REFERENCES barbers(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );

    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
  `);

  console.log("Tabelas criadas/verificadas com sucesso!");

  // Verificar se já existem dados
  const servicesCount = await db.execute("SELECT COUNT(*) as count FROM services");
  const count = (servicesCount.rows[0] as unknown as { count: number }).count;

  if (count === 0) {
    console.log("Banco vazio, executando seed inicial...");
    await seedInitialData();
  } else {
    console.log(`Banco já possui ${count} serviços. Pulando seed.`);
  }
}

async function seedInitialData() {
  const bcrypt = await import("bcrypt");

  // Inserir serviços
  const services = [
    { id: "1", name: "Corte de Cabelo", description: "Corte tradicional ou moderno", duration: 30, price: 40 },
    { id: "2", name: "Barba", description: "Barba completa com toalha quente", duration: 20, price: 30 },
    { id: "3", name: "Corte + Barba", description: "Combo completo", duration: 45, price: 60 },
    { id: "4", name: "Pigmentacao", description: "Pigmentacao de barba ou cabelo", duration: 40, price: 50 },
  ];

  for (const s of services) {
    await db.execute({
      sql: "INSERT INTO services (id, name, description, duration, price) VALUES (?, ?, ?, ?, ?)",
      args: [s.id, s.name, s.description, s.duration, s.price],
    });
  }

  console.log("Servicos inseridos:", services.length);

  // Senha padrao: 123456
  const defaultPasswordHash = bcrypt.hashSync("123456", 10);

  // Inserir barbeiros
  const barbers = [
    {
      id: "1",
      name: "Carlos",
      phone: "(11) 99999-0001",
      workingHours: {
        monday: { start: "09:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
        tuesday: { start: "09:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
        wednesday: { start: "09:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
        thursday: { start: "09:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
        friday: { start: "09:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
        saturday: { start: "09:00", end: "14:00" },
      },
      services: ["1", "2", "3", "4"],
    },
    {
      id: "2",
      name: "Ricardo",
      phone: "(11) 99999-0002",
      workingHours: {
        monday: { start: "10:00", end: "19:00", breaks: [{ start: "13:00", end: "14:00" }] },
        tuesday: { start: "10:00", end: "19:00", breaks: [{ start: "13:00", end: "14:00" }] },
        wednesday: { start: "10:00", end: "19:00", breaks: [{ start: "13:00", end: "14:00" }] },
        thursday: { start: "10:00", end: "19:00", breaks: [{ start: "13:00", end: "14:00" }] },
        friday: { start: "10:00", end: "19:00", breaks: [{ start: "13:00", end: "14:00" }] },
        saturday: { start: "10:00", end: "16:00" },
      },
      services: ["1", "2", "3"],
    },
  ];

  for (const b of barbers) {
    await db.execute({
      sql: "INSERT INTO barbers (id, name, phone, avatar, password_hash, working_hours) VALUES (?, ?, ?, ?, ?, ?)",
      args: [b.id, b.name, b.phone, null, defaultPasswordHash, JSON.stringify(b.workingHours)],
    });

    for (const serviceId of b.services) {
      await db.execute({
        sql: "INSERT INTO barber_services (barber_id, service_id) VALUES (?, ?)",
        args: [b.id, serviceId],
      });
    }
  }

  console.log("Barbeiros inseridos:", barbers.length);
  console.log("\nCredenciais de login:");
  console.log("  Carlos: (11) 99999-0001 / 123456");
  console.log("  Ricardo: (11) 99999-0002 / 123456");
}

setup().catch(console.error);
