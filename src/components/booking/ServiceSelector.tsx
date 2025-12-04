"use client";

import { Service } from "@/types";
import { formatPrice } from "@/lib/appointments";
import { Scissors, Clock, Check, Flame } from "lucide-react";

interface ServiceSelectorProps {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelector({ services, selectedId, onSelect }: ServiceSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Flame className="h-6 w-6 text-[#d4af37]" />
        <p className="text-[#888888] font-corpo">
          Escolhe ai o corte que tu quer, mano
        </p>
      </div>

      <div className="grid gap-3">
        {services.map((service, index) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`relative w-full p-4 rounded text-left transition-all duration-300 animate-slide-up ${
              selectedId === service.id
                ? "bg-gradient-to-r from-[#d4af37]/20 to-[#8b6914]/10 border-2 border-[#d4af37]"
                : "card-quebrada hover-quebrada border-2 border-transparent"
            }`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Check mark quando selecionado */}
            {selectedId === service.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center">
                <Check className="h-4 w-4 text-[#0a0a0a]" />
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Icone */}
              <div className={`flex h-14 w-14 items-center justify-center rounded ${
                selectedId === service.id
                  ? "bg-[#d4af37] text-[#0a0a0a]"
                  : "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30"
              }`}>
                <Scissors className="h-7 w-7" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-titulo text-xl text-[#f5f5f5] tracking-wide">
                  {service.name.toUpperCase()}
                </h3>
                <p className="text-[#888888] text-sm font-corpo mt-1">
                  {service.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs text-[#888888]">
                    <Clock className="h-3 w-3 text-[#d4af37]" />
                    {service.duration} min
                  </span>
                  <span className={`font-titulo text-lg ${
                    selectedId === service.id ? "text-[#d4af37]" : "text-[#d4af37]/80"
                  }`}>
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
