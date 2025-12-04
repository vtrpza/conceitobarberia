"use client";

import { useState, useEffect } from "react";
import { Service, Barber, Appointment } from "@/types";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { BarberSelector } from "@/components/booking/BarberSelector";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { ClientForm } from "@/components/booking/ClientForm";
import { BookingSuccess } from "@/components/booking/BookingSuccess";
import { fetchServices, fetchBarbers, createAppointment } from "@/lib/appointments";
import { ArrowLeft, ChevronRight, Flame } from "lucide-react";
import Link from "next/link";

type Step = "service" | "barber" | "datetime" | "client" | "success";

export default function AgendarPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchServices(), fetchBarbers()])
      .then(([servicesData, barbersData]) => {
        setServices(servicesData);
        setBarbers(barbersData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
  };

  const handleClientSubmit = async (data: { name: string; phone: string }) => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return;

    setIsLoading(true);
    setError(null);

    try {
      const newAppointment = await createAppointment({
        clientName: data.name,
        clientPhone: data.phone,
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
      });
      setAppointment(newAppointment);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setError(null);
    switch (step) {
      case "barber":
        setStep("service");
        break;
      case "datetime":
        setStep("barber");
        break;
      case "client":
        setStep("datetime");
        break;
    }
  };

  const goNext = () => {
    switch (step) {
      case "service":
        if (selectedService) setStep("barber");
        break;
      case "barber":
        if (selectedBarber) setStep("datetime");
        break;
      case "datetime":
        if (selectedDate && selectedTime) setStep("client");
        break;
    }
  };

  const canProceed = () => {
    switch (step) {
      case "service":
        return !!selectedService;
      case "barber":
        return !!selectedBarber;
      case "datetime":
        return !!selectedDate && !!selectedTime;
      default:
        return false;
    }
  };

  const stepTitles: Record<Step, string> = {
    service: "ESCOLHE O CORTE",
    barber: "ESCOLHE O MANO",
    datetime: "MARCA O DIA",
    client: "SEUS DADOS",
    success: "AGENDADO!",
  };

  // Loading state
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-graffiti">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[#888888] font-titulo text-xl">CARREGANDO...</p>
        </div>
      </main>
    );
  }

  // Success state
  if (step === "success" && appointment) {
    return (
      <main className="min-h-screen bg-graffiti px-4 py-6">
        <BookingSuccess appointment={appointment} services={services} barbers={barbers} />
      </main>
    );
  }

  const filteredBarbers = barbers.filter((b) =>
    selectedService ? b.services.includes(selectedService.id) : true
  );

  const stepIndex = ["service", "barber", "datetime", "client"].indexOf(step);

  return (
    <main className="min-h-screen bg-graffiti">
      {/* Header estilo quebrada */}
      <header className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur">
        <div className="flex h-16 items-center gap-4 px-4">
          {step !== "service" ? (
            <button
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <div>
            <h1 className="font-titulo text-xl text-[#f5f5f5] tracking-wide">
              {stepTitles[step]}
            </h1>
            <p className="text-xs text-[#888888] font-corpo">
              Passo {stepIndex + 1} de 4
            </p>
          </div>
        </div>

        {/* Progress bar estilo corrente */}
        <div className="flex gap-1 px-4 pb-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                stepIndex >= i
                  ? "bg-gradient-to-r from-[#d4af37] to-[#8b6914]"
                  : "bg-[#2a2a2a]"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-4 rounded bg-[#8b0000]/20 border border-[#8b0000] p-4 text-[#ff6b6b] font-corpo">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6 pb-28">
        {step === "service" && (
          <ServiceSelector
            services={services}
            selectedId={selectedService?.id || null}
            onSelect={handleServiceSelect}
          />
        )}

        {step === "barber" && (
          <BarberSelector
            barbers={filteredBarbers}
            selectedId={selectedBarber?.id || null}
            onSelect={handleBarberSelect}
          />
        )}

        {step === "datetime" && selectedBarber && selectedService && (
          <DateTimePicker
            barberId={selectedBarber.id}
            serviceDuration={selectedService.duration}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
          />
        )}

        {step === "client" && (
          <ClientForm onSubmit={handleClientSubmit} isLoading={isLoading} />
        )}
      </div>

      {/* Footer com botao */}
      {step !== "client" && step !== "success" && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur p-4">
          <button
            className={`w-full py-4 rounded font-titulo text-xl tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
              canProceed()
                ? "btn-funk"
                : "bg-[#1a1a1a] text-[#888888] border-2 border-[#2a2a2a] cursor-not-allowed"
            }`}
            disabled={!canProceed()}
            onClick={goNext}
          >
            CONTINUAR
            {canProceed() && <Flame className="h-5 w-5" />}
            {!canProceed() && <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      )}
    </main>
  );
}
