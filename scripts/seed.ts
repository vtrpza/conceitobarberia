import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

// Criar diretório data se não existir
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Conectar ao banco de dados
const dbPath = path.join(dataDir, "barbershop.db");
const db = new Database(dbPath);

console.log("Criando banco de dados em:", dbPath);

// Criar tabelas
db.exec(`
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

console.log("Tabelas criadas");

// Limpar dados existentes
db.exec(`
  DELETE FROM barber_services;
  DELETE FROM appointments;
  DELETE FROM barbers;
  DELETE FROM services;
`);

console.log("Dados antigos limpos");

// Inserir serviços
const services = [
  { id: "1", name: "Corte de Cabelo", description: "Corte tradicional ou moderno", duration: 30, price: 40 },
  { id: "2", name: "Barba", description: "Barba completa com toalha quente", duration: 20, price: 30 },
  { id: "3", name: "Corte + Barba", description: "Combo completo", duration: 45, price: 60 },
  { id: "4", name: "Pigmentacao", description: "Pigmentacao de barba ou cabelo", duration: 40, price: 50 },
];

const insertService = db.prepare(
  "INSERT INTO services (id, name, description, duration, price) VALUES (?, ?, ?, ?, ?)"
);

for (const s of services) {
  insertService.run(s.id, s.name, s.description, s.duration, s.price);
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

const insertBarber = db.prepare(
  "INSERT INTO barbers (id, name, phone, avatar, password_hash, working_hours) VALUES (?, ?, ?, ?, ?, ?)"
);

const insertBarberService = db.prepare(
  "INSERT INTO barber_services (barber_id, service_id) VALUES (?, ?)"
);

for (const b of barbers) {
  insertBarber.run(
    b.id,
    b.name,
    b.phone,
    null,
    defaultPasswordHash,
    JSON.stringify(b.workingHours)
  );

  for (const serviceId of b.services) {
    insertBarberService.run(b.id, serviceId);
  }
}

console.log("Barbeiros inseridos:", barbers.length);

db.close();

console.log("\nSeed concluido com sucesso!");
console.log("\nCredenciais de login:");
console.log("  Carlos: (11) 99999-0001 / 123456");
console.log("  Ricardo: (11) 99999-0002 / 123456");
