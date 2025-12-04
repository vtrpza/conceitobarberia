"use client";

import { Appointment, Service, Barber } from "@/types";
import { getServiceById, getBarberById, formatDate, formatPrice } from "@/lib/appointments";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, User, Scissors, Crown, Flame } from "lucide-react";

interface BookingSuccessProps {
  appointment: Appointment;
  services: Service[];
  barbers: Barber[];
}

export function BookingSuccess({ appointment, services, barbers }: BookingSuccessProps) {
  const service = getServiceById(services, appointment.serviceId);
  const barber = getBarberById(barbers, appointment.barberId);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      {/* Icone de sucesso com efeito */}
      <div className="flex flex-col items-center space-y-4 animate-fade-scale">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-[0_0_40px_rgba(34,197,94,0.4)] pulse-gold">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          {/* Efeito de brilho */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        <div className="text-center">
          <h1 className="font-titulo text-3xl text-[#d4af37] tracking-wider gold-shine">
            AGENDADO!
          </h1>
          <p className="font-pixo text-lg text-[#22c55e] rotate-[-1deg] mt-1">
            TA MARCADO, MANO!
          </p>
        </div>
      </div>

      {/* Card com detalhes */}
      <div className="w-full max-w-sm card-quebrada rounded-lg overflow-hidden animate-slide-up delay-200">
        {/* Header do card */}
        <div className="bg-gradient-to-r from-[#d4af37]/20 to-[#8b6914]/10 p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <span className="font-titulo text-sm text-[#888888] tracking-wide">STATUS</span>
            <span className="px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/50 rounded font-pixo text-sm text-[#d4af37] rotate-[-1deg]">
              PENDENTE
            </span>
          </div>
        </div>

        {/* Conteudo */}
        <div className="p-5 space-y-4">
          {/* Servico */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
              <Scissors className="h-6 w-6 text-[#d4af37]" />
            </div>
            <div>
              <p className="font-titulo text-lg text-[#f5f5f5] tracking-wide">
                {service?.name.toUpperCase()}
              </p>
              <p className="text-[#d4af37] font-titulo">
                {formatPrice(service?.price || 0)}
              </p>
            </div>
          </div>

          {/* Barbeiro */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-[#8b0000]/20 border border-[#8b0000]/30">
              <User className="h-6 w-6 text-[#8b0000]" />
            </div>
            <div>
              <p className="text-xs text-[#888888] font-corpo">BARBEIRO</p>
              <p className="font-titulo text-lg text-[#f5f5f5] tracking-wide">
                {barber?.name.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-[#1a1a1a] border border-[#2a2a2a]">
              <Calendar className="h-6 w-6 text-[#888888]" />
            </div>
            <div>
              <p className="text-xs text-[#888888] font-corpo">DATA</p>
              <p className="font-titulo text-lg text-[#f5f5f5] tracking-wide capitalize">
                {formatDate(appointment.date)}
              </p>
            </div>
          </div>

          {/* Horario */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-[#1a1a1a] border border-[#2a2a2a]">
              <Clock className="h-6 w-6 text-[#888888]" />
            </div>
            <div>
              <p className="text-xs text-[#888888] font-corpo">HORARIO</p>
              <p className="font-titulo text-2xl text-[#d4af37] tracking-wide">
                {appointment.time}
              </p>
            </div>
          </div>

          {/* Divisor */}
          <div className="divider-chain" />

          {/* Dados do cliente */}
          <div className="space-y-2 pt-2">
            <p className="text-sm text-[#888888] font-corpo">
              <Crown className="inline h-4 w-4 text-[#d4af37] mr-2" />
              Cliente: <span className="text-[#f5f5f5] font-titulo">{appointment.clientName.toUpperCase()}</span>
            </p>
            <p className="text-sm text-[#888888] font-corpo">
              <Flame className="inline h-4 w-4 text-[#8b0000] mr-2" />
              Zap: <span className="text-[#f5f5f5]">{appointment.clientPhone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="w-full max-w-sm p-4 rounded bg-[#141414]/50 border-l-4 border-[#d4af37] animate-slide-up delay-300">
        <p className="text-sm text-[#888888] font-corpo">
          Aguarda ai que o mano vai confirmar teu horario no zap, beleza? Fica ligado!
        </p>
      </div>

      {/* Botao voltar */}
      <Link
        href="/"
        className="w-full max-w-sm py-4 rounded bg-[#1a1a1a] border-2 border-[#2a2a2a] text-[#f5f5f5] font-titulo text-lg tracking-wide text-center hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 flex items-center justify-center gap-2 animate-slide-up delay-400"
      >
        <Calendar className="h-5 w-5" />
        FAZER NOVO AGENDAMENTO
      </Link>
    </div>
  );
}
