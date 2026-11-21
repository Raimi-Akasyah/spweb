"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { availabilityFallback } from "@/data/availability";
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

type AvailabilityPayload = {
  ok: boolean;
  entries?: AvailabilityDate[];
  error?: string;
};

declare global {
  interface Window {
    senangCallback_homeAvailability?: (payload: AvailabilityPayload) => void;
  }
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function todayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function DateSection() {
  const [month, setMonth] = useState(currentMonth);
  const [dates, setDates] = useState<AvailabilityDate[]>(availabilityFallback);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bookingEndpoint =
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbyFUVZOX9wv9NS9jUM9V91eMTSY9wKqg8BKFJLxSPoBZYMUa51IKP0jfu01GVw1PLQg/exec";

  useEffect(() => {
    const controller = new AbortController();
    let script: HTMLScriptElement | undefined;
    setLoading(true);
    setError("");

    if (bookingEndpoint) {
      const callbackName = "senangCallback_homeAvailability";
      let receivedResponse = false;
      window[callbackName] = (payload) => {
        receivedResponse = true;
        if (!payload.ok || !Array.isArray(payload.entries)) {
          setError(payload.error || "Ketersediaan tarikh tidak dapat dimuatkan.");
          setDates([]);
          setLoading(false);
          return;
        }
        setDates(payload.entries);
        setLoading(false);
      };

      try {
        const url = new URL(bookingEndpoint);
        url.searchParams.set("action", "availability");
        url.searchParams.set("month", month);
        url.searchParams.set("callback", callbackName);
        script = document.createElement("script");
        script.async = true;
        script.src = url.toString();
        script.onerror = () => {
          setError("Ketersediaan tidak dapat dimuatkan. Sahkan semula melalui borang tempahan.");
          setLoading(false);
        };
        script.onload = () => {
          if (!receivedResponse) {
            setError("Respons ketersediaan tidak lengkap. Sahkan semula melalui borang tempahan.");
          }
          setLoading(false);
        };
        document.body.appendChild(script);
      } catch {
        setError("Pautan ketersediaan tidak sah. Sahkan tarikh melalui borang tempahan.");
        setLoading(false);
      }

      return () => {
        controller.abort();
        script?.remove();
        delete window[callbackName];
      };
    }

    const csvUrl = process.env.NEXT_PUBLIC_AVAILABILITY_CSV_URL;
    if (!csvUrl) {
      setDates(availabilityFallback);
      setLoading(false);
      return () => controller.abort();
    }

    fetch(csvUrl, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Availability sheet returned ${response.status}.`);
        return parseAvailabilityCsv(await response.text());
      })
      .then(setDates)
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Ketersediaan tarikh tidak dapat dimuatkan.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [bookingEndpoint, month]);

  const days = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);
    const firstWeekday = (new Date(year, monthNumber - 1, 1).getDay() + 6) % 7;
    const dayCount = new Date(year, monthNumber, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: dayCount }, (_, index) => index + 1),
    ];
  }, [month]);

  const statusByDate = useMemo(
    () => new Map(getAvailabilityForMonth(dates, month).map((entry) => [entry.date, entry])),
    [dates, month],
  );
  const [year, monthNumber] = month.split("-").map(Number);
  const monthTitle = `${monthNames[monthNumber - 1]} ${year}`;
  const selectedStatus = selectedDate ? statusByDate.get(selectedDate)?.status : undefined;
  const previousMonthDisabled = month <= currentMonth();

  function moveMonth(delta: number) {
    setSelectedDate("");
    setMonth((value) => shiftMonth(value, delta));
  }

  function statusLabel(status?: AvailabilityStatus) {
    if (status === "kosong") return "Slot masih ada!";
    if (status === "hampir-penuh") return "Hampir penuh — sahkan segera.";
    if (status === "penuh") return "Tarikh ini sudah penuh.";
    return "Status belum disahkan. Teruskan untuk semakan.";
  }

  return (
    <section id="tarikh">
      <div className="w">
        <div className="tr">
          <div>
            <h2 className="rv">Pilih tarikh. <span className="ser mk">Jom raikan.</span></h2>
            <p className="rv">Klik tarikh idaman kau kat kalendar ni untuk semak slot kosong, pilih vibe, dan terus lock tarikh tanpa borang panjang.</p>
            <div className="sg rv">
              <div><i>1</i>Pilih tarikh</div>
              <div><i>2</i>Kongsi vibe</div>
              <div><i>3</i>Confirm &amp; lock</div>
            </div>
          </div>
          <div className="cal rv">
            <div className="ch">
              <button className="ar" type="button" onClick={() => moveMonth(-1)} disabled={previousMonthDisabled} aria-label="Bulan sebelum">
                <ArrowLeft className="i" />
              </button>
              <b>{monthTitle}</b>
              <button className="ar" type="button" onClick={() => moveMonth(1)} aria-label="Bulan seterusnya">
                <ArrowRight className="i" />
              </button>
            </div>
            <div className="cg" role="grid" aria-label={`Tarikh ${monthTitle}`}>
              {weekDays.map((day) => <span key={day}>{day}</span>)}
              {days.map((day, index) => {
                if (!day) return <i key={`empty-${index}`} aria-hidden="true" />;
                const date = `${month}-${String(day).padStart(2, "0")}`;
                const status = statusByDate.get(date)?.status;
                const isPast = date < todayDate();
                const isFull = status === "penuh";
                const className = [
                  "dy",
                  status === "hampir-penuh" ? "few" : "",
                  isFull ? "full" : "",
                  selectedDate === date ? "sel" : "",
                ].filter(Boolean).join(" ");
                return (
                  <button
                    className={className}
                    type="button"
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    disabled={isPast || isFull}
                    aria-label={`${day} ${monthNames[monthNumber - 1]} ${year}${status ? `, ${statusLabel(status)}` : ""}`}
                    aria-pressed={selectedDate === date}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="lg" aria-label="Petunjuk ketersediaan">
              <span><i />Kosong</span>
              <span><i className="few" />Hampir penuh</span>
              <span><i className="full" />Penuh</span>
            </div>
            <p className="sel-status" aria-live="polite">
              {error
                ? error
                : loading
                  ? "Sedang menyemak ketersediaan..."
                  : selectedDate
                    ? `Tarikh dipilih: ${new Intl.DateTimeFormat("ms-MY", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${selectedDate}T12:00:00`))} — ${statusLabel(selectedStatus)}`
                    : "Pilih satu tarikh untuk semak ketersediaan slot."}
            </p>
            <Link className="btn gd" href={selectedDate ? `/booking?date=${selectedDate}` : "/booking"}>
              Check Availability <ArrowUpRight className="i" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <header className="hero" id="hero">
      <div className="w">
        <div className="hg">
          <div>
            <div className="pill">2026 / 2027 Slots Open · Seluruh Malaysia</div>
            <h1 className="hx">Kahwin je.<br />Biar kami <span className="mk">settle.</span></h1>
            <p className="l">Moodboard aesthetic, vendor on time, timeline jalan. Kau fokus pilih outfit, bergambar, dan enjoy your day.</p>
            <q>No spreadsheet tears. Just happy tears.</q>
            <div className="acts">
              <Link className="btn bk" href="/booking">Lock tarikh dulu <ArrowUpRight className="i" aria-hidden="true" /></Link>
              <WhatsAppButton className="btn wa" variant="outline" message="Hi SenangPlanner, saya ingin berbincang tentang majlis saya.">
                Chat kat WhatsApp
              </WhatsAppButton>
            </div>
            <div className="fine">Free vibe check · Reply bawah 24 jam · Transparent pricing</div>
          </div>
          <div className="col" id="col" aria-label="Kolaj majlis perkahwinan">
            <div className="fr c1"><div className="im p-window" role="img" aria-label="Pasangan pengantin di taman" /></div>
            <div className="fr c2"><div className="im p-sea" role="img" aria-label="Pasangan pengantin di tepi laut" /></div>
            <div className="fr c3"><div className="im p-warm" role="img" aria-label="Majlis pengantin SenangPlanner" /></div>
            <div className="tkm"><small>Event Pass</small>Tarikh anda.</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { DateSection };
