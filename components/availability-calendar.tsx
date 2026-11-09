"use client";

import { useEffect, useMemo, useState } from "react";
import {
  availabilityFallback,
  availabilityFallbackMessage,
} from "@/data/availability";
import {
  getAvailabilityForMonth,
  parseAvailabilityCsv,
  type AvailabilityDate,
  type AvailabilityStatus,
} from "@/lib/availability";
import { WhatsAppButton } from "@/components/whatsapp-button";

const monthNames = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];
const weekDays = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Aha"];

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatSelectedDate(date: string) {
  return new Intl.DateTimeFormat("ms-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function AvailabilityCalendar() {
  const [month, setMonth] = useState(currentMonth);
  const [dates, setDates] = useState<AvailabilityDate[]>([]);
  const [source, setSource] = useState<"sheet" | "fallback">("fallback");
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setSelectedDate("");

    const csvUrl = process.env.NEXT_PUBLIC_AVAILABILITY_CSV_URL;
    if (!csvUrl) {
      setDates(availabilityFallback);
      setSource("fallback");
      setLoading(false);
      return () => controller.abort();
    }

    fetch(csvUrl, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Availability sheet returned ${response.status}.`);
        }
        return parseAvailabilityCsv(await response.text());
      })
      .then((entries) => {
        setDates(entries);
        setSource("sheet");
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Could not load availability.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setSelectedDate("");
  }, [month]);

  const cells = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);
    const firstWeekday = (new Date(year, monthNumber - 1, 1).getDay() + 6) % 7;
    const dayCount = new Date(year, monthNumber, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: dayCount }, (_, index) => index + 1),
    ];
  }, [month]);

  const statusByDate = useMemo(
    () => new Map(getAvailabilityForMonth(dates, month).map((item) => [item.date, item])),
    [dates, month],
  );
  const title = (() => {
    const [, monthNumber] = month.split("-").map(Number);
    const year = month.slice(0, 4);
    return `${monthNames[monthNumber - 1]} ${year}`;
  })();
  const message = selectedDate
    ? `Hi SenangPlanner, saya ingin menyemak availability untuk ${formatSelectedDate(selectedDate)}.`
    : "Hi SenangPlanner, saya ingin menyemak availability untuk tarikh majlis saya.";

  return (
    <section className="availability section-shell" id="availability">
      <div className="availability__intro">
        <p className="eyebrow">Satu langkah lebih dekat</p>
        <h2>Semak tarikh<br /><em>majlis anda.</em></h2>
        <p>{availabilityFallbackMessage}</p>
      </div>
      <div className="calendar">
        <div className="calendar__header">
          <button type="button" onClick={() => setMonth((value) => shiftMonth(value, -1))} aria-label="Bulan sebelumnya">←</button>
          <h3>{title}</h3>
          <button type="button" onClick={() => setMonth((value) => shiftMonth(value, 1))} aria-label="Bulan seterusnya">→</button>
        </div>
        <div className="calendar__grid" role="grid" aria-label={`Tarikh ${title}`}>
          {weekDays.map((day) => <span className="calendar__weekday" key={day}>{day}</span>)}
          {cells.map((day, index) => {
            if (!day) return <span className="calendar__empty" key={`empty-${index}`} />;
            const date = `${month}-${String(day).padStart(2, "0")}`;
            const entry = statusByDate.get(date);
            const status: AvailabilityStatus = entry?.status ?? "kosong";
            const isFull = status === "penuh";
            return (
              <button
                type="button"
                className={`calendar__day calendar__day--${status}${selectedDate === date ? " is-selected" : ""}`}
                key={date}
                disabled={isFull || loading || Boolean(error)}
                aria-label={`${day} ${title}${entry?.note ? `: ${entry.note}` : ""}${isFull ? ", penuh" : ""}`}
                aria-pressed={selectedDate === date}
                onClick={() => setSelectedDate(date)}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="calendar__legend">
          <span><i className="legend-dot legend-dot--open" /> Kosong</span>
          <span><i className="legend-dot legend-dot--soon" /> Hampir penuh</span>
          <span><i className="legend-dot legend-dot--full" /> Penuh</span>
        </div>
        {source === "fallback" && <p className="calendar__notice">Kalendar contoh — sila sahkan ketersediaan bersama pasukan kami.</p>}
        {loading && <p className="calendar__notice" role="status">Memuatkan tarikh…</p>}
        {error && <p className="calendar__error" role="alert">{error}</p>}
        <WhatsAppButton message={message} className="calendar__cta">
          {selectedDate ? `Check ${formatSelectedDate(selectedDate)}` : "Check Availability"} <span aria-hidden="true">↗</span>
        </WhatsAppButton>
      </div>
    </section>
  );
}
