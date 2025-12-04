"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Service } from "@/types";
import { fetchServices, formatPrice } from "@/lib/appointments";
import { Scissors, Clock, MapPin, Phone, Calendar, Crown, Flame } from "lucide-react";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-graffiti">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-12 pt-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/80 via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#8b0000]/15 blur-[120px] rounded-full" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#4a6fa5]/10 blur-[80px] rounded-full" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative mx-auto max-w-md text-center">
          {/* Logo with 3D effect */}
          <div className="mb-8 flex justify-center animate-fade-scale">
            <div className="relative group">
              {/* Glow layers for 3D depth */}
              <div className="absolute inset-0 blur-3xl opacity-40 scale-90">
                <Image
                  src="/logo.png"
                  alt=""
                  width={280}
                  height={280}
                  className="opacity-60"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute inset-0 blur-xl opacity-30 scale-95">
                <Image
                  src="/logo.png"
                  alt=""
                  width={280}
                  height={280}
                  className="opacity-50"
                  aria-hidden="true"
                />
              </div>

              {/* Main logo with 3D transforms */}
              <div className="relative transform transition-all duration-500 group-hover:scale-105"
                   style={{
                     filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 10px 20px rgba(139,0,0,0.3))',
                   }}>
                <Image
                  src="/logo.png"
                  alt="Conceito BarberShop"
                  width={280}
                  height={280}
                  className="relative z-10"
                  priority
                />
              </div>

              {/* Reflection effect */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-gradient-to-b from-white/5 to-transparent blur-sm rounded-full" />
            </div>
          </div>

          {/* Slogan */}
          <p className="mb-8 text-[#888888] font-corpo text-lg tracking-widest animate-slide-up delay-100 uppercase">
            <span className="inline-block w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37] mr-3 align-middle" />
            Corte de Rei
            <span className="inline-block w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37] ml-3 align-middle" />
          </p>

          {/* CTA Button */}
          <Link
            href="/agendar"
            className="group relative inline-flex items-center justify-center w-full py-4 px-8 bg-gradient-to-r from-[#8b0000] via-[#a01010] to-[#8b0000] text-white font-titulo text-xl tracking-wider rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,0,0,0.5)] animate-slide-up delay-200"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Calendar className="mr-3 h-6 w-6" />
            <span>AGENDAR HORÁRIO</span>
            <Flame className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Badge */}
          <div className="mt-6 animate-slide-up delay-300">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#141414] text-[#888888] font-corpo text-sm rounded-full border border-[#2a2a2a]">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Agendamento Online
            </span>
          </div>
        </div>
      </section>

      {/* Divisor chain */}
      <div className="divider-chain mx-4" />

      {/* Servicos - Cards estilo quebrada */}
      <section className="px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-[#d4af37]" />
          <h2 className="font-titulo text-3xl text-[#f5f5f5] tracking-wide">
            NOSSOS CORTES
          </h2>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="text-center text-[#888888] py-8 font-corpo">
              <div className="inline-block w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
              <p className="mt-2">Carregando...</p>
            </div>
          ) : (
            services.map((service, index) => (
              <div
                key={service.id}
                className="card-quebrada rounded p-4 hover-quebrada animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icone com glow dourado */}
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                      <Scissors className="h-6 w-6 text-[#d4af37]" />
                    </div>
                    <div>
                      <h3 className="font-titulo text-xl text-[#f5f5f5] tracking-wide">
                        {service.name.toUpperCase()}
                      </h3>
                      <p className="flex items-center gap-2 text-sm text-[#888888] font-corpo">
                        <Clock className="h-3 w-3 text-[#d4af37]" />
                        {service.duration} min
                      </p>
                    </div>
                  </div>
                  {/* Preco com destaque */}
                  <div className="text-right">
                    <p className="font-titulo text-2xl text-[#d4af37]">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Divisor */}
      <div className="divider-chain mx-4" />

      {/* Info Section - Estilo muro pixado */}
      <section className="px-4 py-10 relative">
        {/* Pixo decorativo */}
        <div className="absolute top-8 right-8 font-pixo text-[#8b0000]/10 text-8xl -rotate-12 select-none pointer-events-none">
          TMJ
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-[#8b0000]" />
          <h2 className="font-titulo text-3xl text-[#f5f5f5] tracking-wide">
            LOCALIZA AI
          </h2>
        </div>

        <div className="space-y-5">
          {/* Endereco */}
          <div className="flex items-start gap-4 p-4 bg-[#141414]/50 rounded border-l-2 border-[#d4af37]">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#d4af37]/10">
              <MapPin className="h-5 w-5 text-[#d4af37]" />
            </div>
            <div>
              <p className="font-titulo text-lg text-[#f5f5f5]">ENDERECO</p>
              <p className="text-[#888888] font-corpo">
                Rua Exemplo, 123 - Centro
                <br />
                Sao Paulo - SP
              </p>
            </div>
          </div>

          {/* Telefone */}
          <div className="flex items-start gap-4 p-4 bg-[#141414]/50 rounded border-l-2 border-[#d4af37]">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#d4af37]/10">
              <Phone className="h-5 w-5 text-[#d4af37]" />
            </div>
            <div>
              <p className="font-titulo text-lg text-[#f5f5f5]">CHAMA NO ZAP</p>
              <p className="text-[#d4af37] font-corpo text-lg">(11) 99999-9999</p>
            </div>
          </div>

          {/* Horario */}
          <div className="flex items-start gap-4 p-4 bg-[#141414]/50 rounded border-l-2 border-[#8b0000]">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#8b0000]/20">
              <Clock className="h-5 w-5 text-[#8b0000]" />
            </div>
            <div>
              <p className="font-titulo text-lg text-[#f5f5f5]">HORARIO DE FUNCIONAMENTO</p>
              <div className="text-[#888888] font-corpo space-y-1">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
                  Segunda a Sexta: 09:00 - 19:00
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
                  Sabado: 09:00 - 16:00
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#8b0000] rounded-full" />
                  Domingo: FECHADO
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Area do barbeiro */}
      <section className="px-4 py-8 border-t border-[#2a2a2a]">
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded text-[#888888] font-titulo text-lg tracking-wide hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
        >
          <Crown className="h-5 w-5" />
          AREA DO BARBEIRO
        </Link>

        {/* Assinatura */}
        <div className="mt-8 text-center">
          <p className="font-pixo text-[#d4af37]/40 text-lg rotate-[-2deg]">
            CONCEITO
          </p>
          <p className="text-[#888888]/50 text-xs font-corpo mt-1">
            Da quebrada pra quebrada
          </p>
        </div>
      </section>
    </main>
  );
}
