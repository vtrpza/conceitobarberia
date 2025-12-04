"use client";

import { useState } from "react";
import { User, Phone, Flame, Check } from "lucide-react";

interface ClientFormProps {
  onSubmit: (data: { name: string; phone: string }) => void;
  isLoading?: boolean;
}

export function ClientForm({ onSubmit, isLoading }: ClientFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.length >= 14) {
      onSubmit({ name: name.trim(), phone });
    }
  };

  const isValid = name.trim().length >= 2 && phone.length >= 14;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Flame className="h-6 w-6 text-[#d4af37]" />
        <p className="text-[#888888] font-corpo">
          Bora finalizar, passa teus dados ai
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center gap-2 font-titulo text-[#f5f5f5] tracking-wide">
            <User className="h-4 w-4 text-[#d4af37]" />
            TEU NOME
          </label>
          <input
            id="name"
            type="text"
            placeholder="Como te chamam na quebrada?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full p-4 rounded bg-[#1a1a1a] border-2 border-[#2a2a2a] text-[#f5f5f5] font-corpo placeholder:text-[#555555] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="flex items-center gap-2 font-titulo text-[#f5f5f5] tracking-wide">
            <Phone className="h-4 w-4 text-[#d4af37]" />
            ZAP / TELEFONE
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={handlePhoneChange}
            required
            maxLength={15}
            className="w-full p-4 rounded bg-[#1a1a1a] border-2 border-[#2a2a2a] text-[#f5f5f5] font-corpo placeholder:text-[#555555] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
          />
        </div>

        {/* Info */}
        <div className="p-4 rounded bg-[#141414] border-l-4 border-[#d4af37]/50">
          <p className="text-sm text-[#888888] font-corpo">
            Vamo te mandar uma mensagem no zap confirmando o horario, beleza?
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`w-full py-4 rounded font-titulo text-xl tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
            isValid && !isLoading
              ? "btn-funk"
              : "bg-[#1a1a1a] text-[#555555] border-2 border-[#2a2a2a] cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
              AGENDANDO...
            </>
          ) : (
            <>
              <Check className="h-5 w-5" />
              CONFIRMAR AGENDAMENTO
            </>
          )}
        </button>
      </form>
    </div>
  );
}
