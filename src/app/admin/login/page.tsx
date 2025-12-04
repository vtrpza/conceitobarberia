"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors, AlertCircle, Phone, Lock, Crown, Flame } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexao. Tenta de novo, mano.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-graffiti px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8b0000]/10 blur-[100px] rounded-full" />

      {/* Pixo decorativo */}
      <div className="absolute top-10 left-10 font-pixo text-[#d4af37]/10 text-8xl -rotate-12 select-none pointer-events-none">
        REI
      </div>
      <div className="absolute bottom-10 right-10 font-pixo text-[#8b0000]/10 text-6xl rotate-12 select-none pointer-events-none">
        BC
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-scale">
          {/* Logo */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] via-[#f5e7a3] to-[#8b6914] shadow-[0_0_40px_rgba(212,175,55,0.4)] pulse-gold">
            <Scissors className="h-12 w-12 text-[#0a0a0a]" />
          </div>

          <h1 className="font-titulo text-3xl text-[#f5f5f5] tracking-wider">
            BARBEARIA
          </h1>
          <h2 className="font-pixo text-2xl text-[#d4af37] spray-text -mt-1 rotate-[-2deg]">
            CONCEITO
          </h2>
          <p className="mt-4 text-[#888888] font-corpo">
            <Crown className="inline h-4 w-4 text-[#d4af37] mr-1" />
            Area restrita pros mano
          </p>
        </div>

        {/* Card de login */}
        <div className="card-quebrada rounded-lg overflow-hidden animate-slide-up delay-200">
          <div className="bg-gradient-to-r from-[#d4af37]/20 to-[#8b6914]/10 p-4 border-b border-[#2a2a2a]">
            <h3 className="font-titulo text-lg text-[#f5f5f5] tracking-wide text-center">
              ACESSO DO BARBEIRO
            </h3>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded bg-[#8b0000]/20 border border-[#8b0000] p-4 text-[#ff6b6b] font-corpo animate-fade-scale">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Telefone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="flex items-center gap-2 font-titulo text-[#f5f5f5] tracking-wide">
                  <Phone className="h-4 w-4 text-[#d4af37]" />
                  TELEFONE
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-0001"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  required
                  className="w-full p-4 rounded bg-[#1a1a1a] border-2 border-[#2a2a2a] text-[#f5f5f5] font-corpo placeholder:text-[#555555] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center gap-2 font-titulo text-[#f5f5f5] tracking-wide">
                  <Lock className="h-4 w-4 text-[#d4af37]" />
                  SENHA
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  className="w-full p-4 rounded bg-[#1a1a1a] border-2 border-[#2a2a2a] text-[#f5f5f5] font-corpo placeholder:text-[#555555] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded font-titulo text-xl tracking-wide transition-all duration-300 flex items-center justify-center gap-2 btn-funk disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    ENTRANDO...
                  </>
                ) : (
                  <>
                    <Flame className="h-5 w-5" />
                    ENTRAR
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-slide-up delay-300">
          <p className="font-pixo text-[#d4af37]/40 text-lg rotate-[-2deg]">
            CONCEITO
          </p>
          <p className="text-[#888888]/50 text-xs font-corpo mt-1">
            So quem e da firma entra
          </p>
        </div>
      </div>
    </main>
  );
}
