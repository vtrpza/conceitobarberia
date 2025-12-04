// Tipos para a aplicação de agendamento

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
}

export interface Barber {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  services: string[]; // IDs dos serviços que oferece
  workingHours: WorkingHours;
}

export interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  start: string; // "09:00"
  end: string;   // "18:00"
  breaks?: Break[];
}

export interface Break {
  start: string;
  end: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  date: string;      // "2024-01-15"
  time: string;      // "14:30"
  status: AppointmentStatus;
  createdAt: string;
  notes?: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface TimeSlot {
  time: string;
  available: boolean;
}
