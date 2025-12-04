"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      {/* Hero Section - ESTILO QUEBRADA */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b0000]/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4af37]/10 blur-[80px] rounded-full" />

        {/* Pixo decorativo no canto */}
        <div className="absolute top-4 right-4 font-pixo text-[#d4af37]/20 text-6xl rotate-12 select-none">
          BC
        </div>

        <div className="relative mx-auto max-w-md text-center">
          {/* Logo com efeito gold */}
          <div className="mb-6 flex justify-center animate-fade-scale">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] via-[#f5e7a3] to-[#8b6914] shadow-[0_0_40px_rgba(212,175,55,0.4)] pulse-gold">
                <Scissors className="h-14 w-14 text-[#0a0a0a] scissors-icon" />
              </div>
              {/* Corrente decorativa */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            </div>
          </div>

          {/* Titulo estilo pixo */}
          <div className="mb-2 animate-slide-up">
            <h1 className="font-titulo text-5xl tracking-wider gold-shine">
              BARBEARIA
            </h1>
            <h2 className="font-pixo text-4xl text-[#d4af37] spray-text -mt-1 rotate-[-2deg]">
              CONCEITO
            </h2>
          </div>

          {/* Slogan da quebrada */}
          <p className="mb-8 text-[#888888] font-corpo text-lg tracking-wide animate-slide-up delay-100">
            <Crown className="inline h-4 w-4 text-[#d4af37] mr-1" />
            CORTE DE REI NA QUEBRADA
            <Crown className="inline h-4 w-4 text-[#d4af37] ml-1" />
          </p>

          {/* CTA Button estilo funk */}
          <Link
            href="/agendar"
            className="group relative inline-flex items-center justify-center w-full py-4 px-8 btn-funk rounded animate-slide-up delay-200"
          >
            <Calendar className="mr-3 h-6 w-6" />
            <span className="text-xl">AGENDAR HORARIO</span>
            <Flame className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Tag estilo graffiti */}
          <div className="mt-6 animate-slide-up delay-300">
            <span className="inline-block px-4 py-1 bg-[#8b0000] text-white font-pixo text-sm rounded rotate-[-1deg] border border-[#d4af37]/30">
              100% QUEBRADA
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
