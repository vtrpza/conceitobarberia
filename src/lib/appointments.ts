import { Appointment, TimeSlot, Service, Barber } from "@/types";

// Cache para dados estáticos
let servicesCache: Service[] | null = null;
let barbersCache: Barber[] | null = null;

// ============ API CALLS ============

export async function fetchServices(): Promise<Service[]> {
  if (servicesCache) return servicesCache;

  const response = await fetch("/api/services");
  if (!response.ok) throw new Error("Erro ao buscar serviços");
  servicesCache = await response.json();
  return servicesCache!;
}

export async function fetchBarbers(): Promise<Barber[]> {
  if (barbersCache) return barbersCache;

  const response = await fetch("/api/barbers");
  if (!response.ok) throw new Error("Erro ao buscar barbeiros");
  barbersCache = await response.json();
  return barbersCache!;
}

export async function fetchTimeSlots(
  barberId: string,
  date: string,
  duration: number
): Promise<TimeSlot[]> {
  const params = new URLSearchParams({
    barberId,
    date,
    duration: duration.toString(),
  });

  const response = await fetch(`/api/appointments/slots?${params}`);
  if (!response.ok) throw new Error("Erro ao buscar horários");
  return response.json();
}

export async function createAppointment(data: {
  clientName: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}): Promise<Appointment> {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao criar agendamento");
  }

  return response.json();
}

export async function fetchAppointments(
  date?: string,
  barberId?: string
): Promise<Appointment[]> {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (barberId) params.set("barberId", barberId);

  const response = await fetch(`/api/appointments?${params}`);
  if (!response.ok) {
    if (response.status === 401) throw new Error("Não autorizado");
    throw new Error("Erro ao buscar agendamentos");
  }
  return response.json();
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment["status"]
): Promise<boolean> {
  const response = await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Não autorizado");
    throw new Error("Erro ao atualizar agendamento");
  }
  return true;
}

// ============ HELPERS ============

export function getServiceById(services: Service[], id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getBarberById(barbers: Barber[], id: string): Barber | undefined {
  return barbers.find((b) => b.id === id);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Limpar cache (útil após login/logout)
export function clearCache() {
  servicesCache = null;
  barbersCache = null;
}
