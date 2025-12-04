"use client";

import { Barber } from "@/types";
import { User, Check, Crown } from "lucide-react";

interface BarberSelectorProps {
  barbers: Barber[];
  selectedId: string | null;
  onSelect: (barber: Barber) => void;
}

export function BarberSelector({ barbers, selectedId, onSelect }: BarberSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="h-6 w-6 text-[#d4af37]" />
        <p className="text-[#888888] font-corpo">
          Qual mano vai te atender?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {barbers.map((barber, index) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber)}
            className={`relative p-5 rounded text-center transition-all duration-300 animate-slide-up ${
              selectedId === barber.id
                ? "bg-gradient-to-br from-[#d4af37]/20 to-[#8b6914]/10 border-2 border-[#d4af37]"
                : "card-quebrada hover-quebrada border-2 border-transparent"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Check mark */}
            {selectedId === barber.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#d4af37] flex items-center justify-center">
                <Check className="h-3 w-3 text-[#0a0a0a]" />
              </div>
            )}

            {/* Avatar */}
            <div className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full transition-all ${
              selectedId === barber.id
                ? "bg-gradient-to-br from-[#d4af37] to-[#8b6914] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                : "bg-[#1a1a1a] border-2 border-[#2a2a2a]"
            }`}>
              <User className={`h-10 w-10 ${
                selectedId === barber.id ? "text-[#0a0a0a]" : "text-[#d4af37]"
              }`} />
            </div>

            {/* Nome */}
            <h3 className={`font-titulo text-xl tracking-wide ${
              selectedId === barber.id ? "text-[#d4af37]" : "text-[#f5f5f5]"
            }`}>
              {barber.name.toUpperCase()}
            </h3>

            {/* Tag */}
            <p className="text-xs text-[#888888] font-pixo mt-1 rotate-[-1deg]">
              NA ATIVA
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
