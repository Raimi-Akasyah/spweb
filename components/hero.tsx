"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { availabilityFallback } from "@/data/availability";
import { publicAssetPath } from "@/lib/public-asset";
import {
  fetchAvailabilityMonth,
  readCachedAvailability,
} from "@/lib/availability-client";
import {
  getAvailabilityForMonth,
  parseAvailabilityCsv,
  type AvailabilityDate,
  type AvailabilityStatus,
} from "@/lib/availability";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";

const monthNames = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];
const weekDays = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Aha"];

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
  const [loadedMonth, setLoadedMonth] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bookingEndpoint =
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbyFUVZOX9wv9NS9jUM9V91eMTSY9wKqg8BKFJLxSPoBZYMUa51IKP0jfu01GVw1PLQg/exec";

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setError("");

    if (bookingEndpoint) {
      const cached = readCachedAvailability(bookingEndpoint, month);
      if (cached) {
        setDates(cached.entries);
        setLoadedMonth(month);
      } else {
        setLoadedMonth(null);
      }
      setLoading(!cached?.isFresh);

      fetchAvailabilityMonth(bookingEndpoint, month)
        .then((entries) => {
          if (!active) return;
          setDates(entries);
          setLoadedMonth(month);
          setError("");
        })
        .catch((cause: unknown) => {
          if (!active) return;
          setError(cause instanceof Error
            ? cause.message
            : "Ketersediaan tarikh tidak dapat dimuatkan.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      void fetchAvailabilityMonth(bookingEndpoint, shiftMonth(month, 1)).catch((cause: unknown) => {
        console.warn("Could not prefetch next month's availability.", cause);
      });

      return () => {
        active = false;
        controller.abort();
      };
    }

    const csvUrl = process.env.NEXT_PUBLIC_AVAILABILITY_CSV_URL;
    if (!csvUrl) {
      setDates(availabilityFallback);
      setLoadedMonth(null);
      setLoading(false);
      return () => {
        active = false;
        controller.abort();
      };
    }

    setLoading(true);
    fetch(csvUrl, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Availability sheet returned ${response.status}.`);
        return parseAvailabilityCsv(await response.text());
      })
      .then((entries) => {
        if (!active) return;
        setDates(entries);
        setLoadedMonth(month);
      })
      .catch((cause: unknown) => {
        if (!active || (cause instanceof DOMException && cause.name === "AbortError")) return;
        setError(cause instanceof Error ? cause.message : "Ketersediaan tarikh tidak dapat dimuatkan.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
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
  const hasAvailability = loadedMonth === month;
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
                  isPast ? "past" : "",
                  !hasAvailability ? "unknown" : "",
                  selectedDate === date ? "sel" : "",
                ].filter(Boolean).join(" ");
                return (
                  <button
                    className={className}
                    type="button"
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    disabled={isPast || isFull || !hasAvailability}
                    aria-label={`${day} ${monthNames[monthNumber - 1]} ${year}${isPast ? ", tarikh lepas" : isFull ? ", sudah ditempah" : status ? `, ${statusLabel(status)}` : ""}`}
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
              <span><i className="full" />Ditempah</span>
              <span><i className="past" />Tarikh lepas</span>
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
  const { language } = useLanguage();
  const bm = language === "bm";

  return (
    <header className="hero" id="hero">
      <div className="w">
        <div className="hg">
          <div className="hero-copy">
            <div className="pill">{bm ? "Pengurusan Acara & Majlis" : "Event & Celebration Management"}</div>
            <h1 className="hx">{bm ? "Kami datang," : "We come,"}<br /><span>{bm ? "anda senang." : "you relax."}</span></h1>
            <p className="l">{bm
              ? "Dari acara korporat dan pelancaran produk hingga majlis perkahwinan, kami susun atur cara, selaras pasukan dan kendalikan perjalanan acara pada hari sebenar."
              : "From corporate events and product launches to weddings, we organise the run of show, align the team and manage the event from start to finish."}</p>
            <q>{bm ? "Teratur di belakang. Lancar di hadapan." : "Organised behind the scenes. Seamless on stage."}</q>
            <div className="acts">
              <Link className="btn bk" href="/booking">
                {bm ? "Tempah Tarikh" : "Book Your Date"} <ArrowUpRight className="i" aria-hidden="true" />
              </Link>
              <WhatsAppButton className="btn wa" variant="outline" message={bm
                ? "Hi Senang Planner! Saya ingin bertanya tentang servis acara."
                : "Hi Senang Planner! I have a question about your event services."}>
                {bm ? "Tanya di WhatsApp" : "Ask on WhatsApp"}
              </WhatsAppButton>
              <Link className="hero-secondary" href="/#servis">
                {bm ? "Terokai Servis Kami" : "Explore Our Services"} <ArrowRight className="i" aria-hidden="true" />
              </Link>
            </div>
            <div className="fine">{bm ? "Kuala Lumpur · Selangor · Negeri Sembilan" : "Kuala Lumpur · Selangor · Negeri Sembilan"}</div>
          </div>
          <div className="hero-collage" aria-label={bm ? "Kolaj majlis yang dikendalikan Senang Planners" : "Collage of events handled by Senang Planners"}>
            <div className="fr c1">
              <div className="im p-window">
                <Image src={publicAssetPath("/images/event-arisa-hakim.jpg")} alt="Pasukan Senang Planners di majlis persandingan Arisa Sofia dan Hakim" fill priority sizes="(max-width: 700px) 45vw, 260px" />
              </div>
            </div>
            <div className="fr c2">
              <div className="im p-sea">
                <Image src={publicAssetPath("/images/event-ismal-farhan.jpg")} alt="Pasukan Senang Planners di majlis Isma dan Farhan" fill sizes="(max-width: 700px) 45vw, 230px" />
              </div>
            </div>
            <div className="fr c3">
              <div className="im p-warm">
                <Image src={publicAssetPath("/images/event-syafiq-izzaty.jpg")} alt="Pasukan Senang Planners bersama pengantin Syafiq dan Izzaty" fill sizes="(max-width: 700px) 60vw, 310px" />
              </div>
            </div>
            <div className="tkm"><small>Event Pass</small>{bm ? "Tarikh anda." : "Your date."}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { DateSection };
