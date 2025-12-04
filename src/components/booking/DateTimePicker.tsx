"use client";

import { useState, useEffect } from "react";
import { TimeSlot } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { fetchTimeSlots, formatDate } from "@/lib/appointments";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, Loader2 } from "lucide-react";

interface DateTimePickerProps {
  barberId: string;
  serviceDuration: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export function DateTimePicker({
  barberId,
  serviceDuration,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: DateTimePickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (selectedDate && barberId) {
      setLoadingSlots(true);
      fetchTimeSlots(barberId, selectedDate, serviceDuration)
        .then(setTimeSlots)
        .catch(() => setTimeSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, barberId, serviceDuration]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = date.toISOString().split("T")[0];
      onSelectDate(dateStr);
      onSelectTime("");
    }
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  return (
    <div className="space-y-6">
      {/* Calendario */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-[#d4af37]" />
          <h2 className="font-titulo text-xl text-[#f5f5f5] tracking-wide">
            ESCOLHE O DIA
          </h2>
        </div>

        <div className="card-quebrada rounded p-4">
          <Calendar
            mode="single"
            selected={selectedDate ? new Date(selectedDate + "T12:00:00") : undefined}
            onSelect={handleDateSelect}
            disabled={(date) => date < today || date > maxDate || date.getDay() === 0}
            locale={ptBR}
            className="rounded-md !bg-transparent"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "font-titulo text-lg text-[#f5f5f5] tracking-wide",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded hover:bg-[#2a2a2a] hover:border-[#d4af37] transition-all inline-flex items-center justify-center text-[#888888] hover:text-[#d4af37]",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-[#888888] rounded-md w-9 font-titulo text-[0.8rem] tracking-wide",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-corpo rounded hover:bg-[#d4af37]/20 hover:text-[#d4af37] transition-all aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_selected: "bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37] hover:text-[#0a0a0a] focus:bg-[#d4af37] focus:text-[#0a0a0a] font-bold",
              day_today: "border-2 border-[#d4af37]/50 text-[#d4af37]",
              day_outside: "day-outside text-[#555555] opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-[#555555] opacity-30 cursor-not-allowed",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
      </div>

      {/* Horarios */}
      {selectedDate && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-[#d4af37]" />
            <h2 className="font-titulo text-xl text-[#f5f5f5] tracking-wide">
              HORARIOS - {formatDate(selectedDate).toUpperCase()}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {loadingSlots ? (
              <div className="col-span-4 flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
              </div>
            ) : timeSlots.length > 0 ? (
              timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  className={`py-3 px-2 rounded font-titulo text-sm tracking-wide transition-all duration-200 ${
                    selectedTime === slot.time
                      ? "bg-[#d4af37] text-[#0a0a0a] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : slot.available
                      ? "bg-[#1a1a1a] text-[#f5f5f5] border border-[#2a2a2a] hover:border-[#d4af37] hover:text-[#d4af37]"
                      : "bg-[#141414] text-[#555555] line-through cursor-not-allowed opacity-50"
                  }`}
                >
                  {slot.time}
                </button>
              ))
            ) : (
              <div className="col-span-4 py-8 text-center">
                <p className="text-[#888888] font-corpo">
                  Nenhum horario disponivel nesse dia, mano
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
