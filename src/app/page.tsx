"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Service } from "@/types";
import { fetchServices, formatPrice } from "@/lib/appointments";
import { Scissors, Clock, MapPin, Phone, Calendar, Star, ChevronRight } from "lucide-react";

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
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-10">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d12] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8b0000]/10 blur-[150px] rounded-full" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#4a6fa5]/8 blur-[100px] rounded-full" />

        <div className="relative mx-auto max-w-md text-center">
          {/* Logo with premium 3D effect */}
          <div className="mb-10 flex justify-center">
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute inset-0 blur-3xl opacity-30 scale-75">
                <Image
                  src="/logo.png"
                  alt=""
                  width={320}
                  height={320}
                  className="opacity-50"
                  aria-hidden="true"
                />
              </div>

              {/* Mid glow */}
              <div className="absolute inset-0 blur-2xl opacity-20 scale-90">
                <Image
                  src="/logo.png"
                  alt=""
                  width={320}
                  height={320}
                  className="opacity-40"
                  aria-hidden="true"
                />
              </div>

              {/* Main logo */}
              <div
                className="relative transform transition-all duration-700 group-hover:scale-[1.02]"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.6)) drop-shadow(0 12px 24px rgba(139,0,0,0.25))',
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Conceito BarberShop"
                  width={320}
                  height={320}
                  className="relative z-10"
                  priority
                />
              </div>

              {/* Floor reflection */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-16 bg-gradient-to-t from-transparent via-white/[0.02] to-transparent blur-sm rounded-full" />
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-10 animate-slide-up">
            <p className="text-[#666] font-corpo text-sm tracking-[0.3em] uppercase mb-3">
              Tradição & Precisão
            </p>
            <h1 className="text-[#e5e5e5] font-titulo text-2xl tracking-wide leading-relaxed">
              Onde cada corte conta uma história
            </h1>
          </div>

          {/* CTA Button */}
          <Link
            href="/agendar"
            className="group relative inline-flex items-center justify-center w-full py-4 px-8 bg-[#8b0000] text-white font-titulo text-lg tracking-wider rounded overflow-hidden transition-all duration-300 hover:bg-[#a01010] animate-slide-up delay-100"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Calendar className="mr-3 h-5 w-5" />
            <span>AGENDAR HORÁRIO</span>
            <ChevronRight className="ml-2 h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 animate-slide-up delay-200">
            <div className="flex items-center gap-2 text-[#555] text-sm font-corpo">
              <Star className="h-4 w-4 text-[#d4af37] fill-[#d4af37]" />
              <span>4.9</span>
            </div>
            <div className="w-px h-4 bg-[#333]" />
            <div className="text-[#555] text-sm font-corpo">
              +500 clientes
            </div>
            <div className="w-px h-4 bg-[#333]" />
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[#555] text-sm font-corpo">Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#222] to-transparent" />

      {/* Services Section */}
      <section className="px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#555] font-corpo text-xs tracking-[0.2em] uppercase mb-1">
              O que oferecemos
            </p>
            <h2 className="font-titulo text-2xl text-[#e5e5e5] tracking-wide">
              SERVIÇOS
            </h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-[#222] to-transparent ml-6" />
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-[#555] py-12 font-corpo">
              <div className="inline-block w-6 h-6 border-2 border-[#333] border-t-[#8b0000] rounded-full animate-spin" />
            </div>
          ) : (
            services.map((service, index) => (
              <div
                key={service.id}
                className="group flex items-center justify-between p-4 bg-[#111] rounded border border-[#1a1a1a] hover:border-[#252525] transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded bg-[#1a1a1a] group-hover:bg-[#8b0000]/10 transition-colors duration-300">
                    <Scissors className="h-5 w-5 text-[#555] group-hover:text-[#8b0000] transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-titulo text-lg text-[#e5e5e5] tracking-wide">
                      {service.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-[#555] font-corpo">
                      <Clock className="h-3 w-3" />
                      {service.duration} min
                    </p>
                  </div>
                </div>
                <p className="font-titulo text-xl text-[#e5e5e5]">
                  {formatPrice(service.price)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#222] to-transparent" />

      {/* Info Section */}
      <section className="px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#555] font-corpo text-xs tracking-[0.2em] uppercase mb-1">
              Como nos encontrar
            </p>
            <h2 className="font-titulo text-2xl text-[#e5e5e5] tracking-wide">
              CONTATO
            </h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-[#222] to-transparent ml-6" />
        </div>

        <div className="space-y-4">
          {/* Address */}
          <div className="flex items-start gap-4 p-4 bg-[#111] rounded border border-[#1a1a1a]">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#1a1a1a]">
              <MapPin className="h-5 w-5 text-[#555]" />
            </div>
            <div>
              <p className="font-titulo text-sm text-[#888] tracking-wide mb-1">ENDEREÇO</p>
              <p className="text-[#e5e5e5] font-corpo">
                Rua Exemplo, 123 - Centro
              </p>
              <p className="text-[#555] font-corpo text-sm">
                São Paulo - SP
              </p>
            </div>
          </div>

          {/* Phone */}
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 bg-[#111] rounded border border-[#1a1a1a] hover:border-[#252525] transition-colors group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#1a1a1a] group-hover:bg-emerald-500/10 transition-colors">
              <Phone className="h-5 w-5 text-[#555] group-hover:text-emerald-500 transition-colors" />
            </div>
            <div>
              <p className="font-titulo text-sm text-[#888] tracking-wide mb-1">WHATSAPP</p>
              <p className="text-[#e5e5e5] font-corpo group-hover:text-emerald-500 transition-colors">
                (11) 99999-9999
              </p>
            </div>
          </a>

          {/* Hours */}
          <div className="flex items-start gap-4 p-4 bg-[#111] rounded border border-[#1a1a1a]">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#1a1a1a]">
              <Clock className="h-5 w-5 text-[#555]" />
            </div>
            <div className="flex-1">
              <p className="font-titulo text-sm text-[#888] tracking-wide mb-2">HORÁRIOS</p>
              <div className="space-y-1.5 font-corpo text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888]">Segunda a Sexta</span>
                  <span className="text-[#e5e5e5]">09:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Sábado</span>
                  <span className="text-[#e5e5e5]">09:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Domingo</span>
                  <span className="text-[#555]">Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="px-4 py-8 border-t border-[#151515]">
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#111] border border-[#1a1a1a] rounded text-[#555] font-corpo text-sm tracking-wide hover:border-[#252525] hover:text-[#888] transition-all duration-300"
        >
          Área Restrita
        </Link>

        <p className="mt-6 text-center text-[#333] text-xs font-corpo">
          © 2024 Conceito BarberShop
        </p>
      </section>
    </main>
  );
}
