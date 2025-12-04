"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Appointment, Service, Barber } from "@/types";
import {
  fetchAppointments,
  fetchServices,
  fetchBarbers,
  getServiceById,
  getBarberById,
  updateAppointmentStatus,
  formatPrice,
  clearCache,
} from "@/lib/appointments";
import { ArrowLeft, Clock, User, Phone, Check, X, LogOut, Loader2, Crown, Flame, Calendar } from "lucide-react";
import Link from "next/link";

const statusColors: Record<Appointment["status"], string> = {
  pending: "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/50",
  confirmed: "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50",
  cancelled: "bg-[#8b0000]/20 text-[#ff6b6b] border-[#8b0000]/50",
  completed: "bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/50",
};

const statusLabels: Record<Appointment["status"], string> = {
  pending: "PENDENTE",
  confirmed: "CONFIRMADO",
  cancelled: "CANCELADO",
  completed: "CONCLUIDO",
};

export default function AdminPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedBarber, setSelectedBarber] = useState<string>("all");

  useEffect(() => {
    Promise.all([fetchServices(), fetchBarbers()])
      .then(([servicesData, barbersData]) => {
        setServices(servicesData);
        setBarbers(barbersData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, selectedBarber]);

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments(
        selectedDate,
        selectedBarber === "all" ? undefined : selectedBarber
      );
      setAppointments(data);
    } catch (err) {
      if (err instanceof Error && err.message === "Nao autorizado") {
        router.push("/admin/login");
      }
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: Appointment["status"]) => {
    try {
      await updateAppointmentStatus(id, status);
      loadAppointments();
    } catch (err) {
      if (err instanceof Error && err.message === "Nao autorizado") {
        router.push("/admin/login");
      }
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearCache();
      router.push("/admin/login");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppointments = appointments
    .sort((a, b) => a.time.localeCompare(b.time));

  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" }).toUpperCase(),
      });
    }
    return days;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-graffiti">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#d4af37] mx-auto" />
          <p className="mt-4 text-[#888888] font-titulo text-xl">CARREGANDO...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-graffiti">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-titulo text-xl text-[#f5f5f5] tracking-wide flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#d4af37]" />
                PAINEL DO BARBEIRO
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded bg-[#8b0000]/20 border border-[#8b0000]/50 text-[#ff6b6b] hover:bg-[#8b0000]/30 transition-all"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="border-b border-[#2a2a2a] px-4 py-4">
        <div className="space-y-4">
          {/* Seletor de data */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {getNextDays().map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDate(day.value)}
                className={`flex-shrink-0 px-4 py-2 rounded font-titulo text-sm tracking-wide transition-all ${
                  selectedDate === day.value
                    ? "bg-[#d4af37] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a] hover:border-[#d4af37] hover:text-[#d4af37]"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Seletor de barbeiro */}
          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
            className="w-full p-3 rounded bg-[#1a1a1a] border-2 border-[#2a2a2a] text-[#f5f5f5] font-corpo focus:border-[#d4af37] focus:outline-none transition-all"
          >
            <option value="all">TODOS OS BARBEIROS</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de agendamentos */}
      <div className="px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-[#d4af37]" />
            <h2 className="font-titulo text-xl text-[#f5f5f5] tracking-wide">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).toUpperCase()}
            </h2>
          </div>
          <span className="px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/50 rounded font-pixo text-sm text-[#d4af37]">
            {filteredAppointments.length} AGENDAMENTOS
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="card-quebrada rounded-lg p-8 text-center">
            <Flame className="h-12 w-12 text-[#888888] mx-auto mb-4" />
            <p className="text-[#888888] font-corpo text-lg">
              Nenhum agendamento pra essa data, mano
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt, index) => {
              const service = getServiceById(services, apt.serviceId);
              const barber = getBarberById(barbers, apt.barberId);

              return (
                <div
                  key={apt.id}
                  className="card-quebrada rounded-lg overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header do card */}
                  <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                        <Clock className="h-6 w-6 text-[#d4af37]" />
                      </div>
                      <span className="font-titulo text-2xl text-[#d4af37] tracking-wide">
                        {apt.time}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded border font-pixo text-xs ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
                    </span>
                  </div>

                  {/* Conteudo */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-[#888888]" />
                      <span className="font-titulo text-lg text-[#f5f5f5]">
                        {apt.clientName.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#888888]" />
                      <span className="text-[#888888] font-corpo">{apt.clientPhone}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
                      <span className="text-[#888888] font-corpo">
                        {service?.name} com {barber?.name}
                      </span>
                      <span className="font-titulo text-lg text-[#d4af37]">
                        {formatPrice(service?.price || 0)}
                      </span>
                    </div>

                    {/* Acoes */}
                    {apt.status === "pending" && (
                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => handleStatusChange(apt.id, "confirmed")}
                          className="flex-1 py-3 rounded bg-[#22c55e]/20 border border-[#22c55e]/50 text-[#22c55e] font-titulo tracking-wide hover:bg-[#22c55e]/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="h-5 w-5" />
                          CONFIRMAR
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt.id, "cancelled")}
                          className="flex-1 py-3 rounded bg-[#8b0000]/20 border border-[#8b0000]/50 text-[#ff6b6b] font-titulo tracking-wide hover:bg-[#8b0000]/30 transition-all flex items-center justify-center gap-2"
                        >
                          <X className="h-5 w-5" />
                          CANCELAR
                        </button>
                      </div>
                    )}

                    {apt.status === "confirmed" && (
                      <button
                        onClick={() => handleStatusChange(apt.id, "completed")}
                        className="w-full py-3 rounded bg-[#1a1a1a] border-2 border-[#2a2a2a] text-[#888888] font-titulo tracking-wide hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
                      >
                        MARCAR COMO CONCLUIDO
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
