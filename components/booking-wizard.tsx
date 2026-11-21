"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { availabilityFallback } from "@/data/availability";
import {
  getAvailabilityForMonth,
  parseAvailabilityCsv,
  type AvailabilityDate,
  type AvailabilityStatus,
} from "@/lib/availability";

const monthNames = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];
const weekDays = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Aha"];
const eventTypes = ["Nikah", "Sanding", "Nikah + Sanding", "Majlis Hari Jadi", "Lain-lain"];
const serviceOptions = [
  "Event Coordinator",
  "Emcee",
  "Event Planner",
  "PA System (include Audioman)",
  "Audioman (tanpa PA system)",
  "Lain-lain",
];

type AvailabilityPayload = {
  ok: boolean;
  entries?: AvailabilityDate[];
  error?: string;
};

type TicketDetails = {
  name: string;
  eventTime: string;
  eventType: string;
  eventTypeOther: string;
  guestCount: string;
  venue: string;
  services: string[];
  serviceOther: string;
};

const emptyTicketDetails: TicketDetails = {
  name: "",
  eventTime: "",
  eventType: "",
  eventTypeOther: "",
  guestCount: "100",
  venue: "",
  services: [],
  serviceOther: "",
};

type BookingMessage = {
  type: "senangplanner-booking-result";
  requestId: string;
  result: {
    ok: boolean;
    code?: string;
    eventDate?: string;
    message: string;
  };
};

declare global {
  interface Window {
    senangCallback_senangPlannerAvailability?: (payload: AvailabilityPayload) => void;
  }
}

function todayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

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

function hashString(value: string) {
  let hash = 7;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function createTicketBars(seed: number) {
  let value = seed || 1;
  return Array.from({ length: 34 }, () => {
    value = (value * 1103515245 + 12345) >>> 0;
    return 1 + ((value >>> 8) % 4);
  });
}

export function BookingWizard() {
  const [month, setMonth] = useState(currentMonth);
  const [dates, setDates] = useState<AvailabilityDate[]>([]);
  const [source, setSource] = useState<"sheet" | "fallback">("fallback");
  const [selectedDate, setSelectedDate] = useState("");
  const [step, setStep] = useState(1);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails>(emptyTicketDetails);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [proofFileName, setProofFileName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const requestIdInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const proofDataInputRef = useRef<HTMLInputElement>(null);
  const proofTypeInputRef = useRef<HTMLInputElement>(null);
  const proofNameInputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef("");
  const preparedSubmitRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const bookingEndpoint = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "";
  const ticketType = ticketDetails.eventType === "Lain-lain"
    ? ticketDetails.eventTypeOther || "Lain-lain"
    : ticketDetails.eventType;
  const ticketServices = ticketDetails.services
    .map((service) => service === "Lain-lain" && ticketDetails.serviceOther
      ? ticketDetails.serviceOther
      : service)
    .join(", ");
  const ticketSeed = useMemo(
    () => hashString(`${selectedDate}${ticketDetails.name}${ticketDetails.venue}${ticketType}`),
    [selectedDate, ticketDetails.name, ticketDetails.venue, ticketType],
  );
  const ticketBars = useMemo(() => createTicketBars(ticketSeed), [ticketSeed]);
  const ticketCode = `SP-${String((ticketSeed % 900000) + 100000)}`;

  function updateTicketDetails() {
    const form = formRef.current;
    if (!form) return;
    const values = new FormData(form);
    setTicketDetails({
      name: String(values.get("name") ?? ""),
      eventTime: String(values.get("eventTime") ?? ""),
      eventType: String(values.get("eventType") ?? ""),
      eventTypeOther: String(values.get("eventTypeOther") ?? ""),
      guestCount: String(values.get("guestCount") ?? ""),
      venue: String(values.get("venue") ?? ""),
      services: values.getAll("services").map(String),
      serviceOther: String(values.get("serviceOther") ?? ""),
    });
  }

  useEffect(() => {
    const controller = new AbortController();
    let script: HTMLScriptElement | undefined;
    setLoading(true);
    setError("");
    setSelectedDate("");

    if (bookingEndpoint) {
      const callbackName = "senangCallback_senangPlannerAvailability";
      window[callbackName] = (payload) => {
        if (!payload.ok || !payload.entries) {
          setError(payload.error || "Could not load availability.");
          return;
        }
        setDates(payload.entries);
        setSource("sheet");
      };
      script = document.createElement("script");
      script.async = true;
      script.onerror = () => setError("Availability is temporarily unavailable. Please try again.");
      const url = new URL(bookingEndpoint);
      url.searchParams.set("action", "availability");
      url.searchParams.set("month", month);
      url.searchParams.set("callback", callbackName);
      script.src = url.toString();
      document.body.appendChild(script);
      script.onload = () => setLoading(false);

      return () => {
        controller.abort();
        script?.remove();
        delete window[callbackName];
      };
    }

    const csvUrl = process.env.NEXT_PUBLIC_AVAILABILITY_CSV_URL;
    if (!csvUrl) {
      setDates((entries) => entries.length ? entries : availabilityFallback);
      setSource("fallback");
      setLoading(false);
      return;
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
  }, [bookingEndpoint, month, refreshKey]);

  useEffect(() => {
    setSelectedDate("");
  }, [month]);

  useEffect(() => {
    const handleBookingMessage = (event: MessageEvent<BookingMessage>) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (
        event.origin !== "https://script.google.com" &&
        !event.origin.endsWith(".googleusercontent.com")
      ) {
        return;
      }

      const data: unknown = event.data;
      if (
        !data ||
        typeof data !== "object" ||
        !("type" in data) ||
        data.type !== "senangplanner-booking-result" ||
        !("requestId" in data) ||
        data.requestId !== requestIdRef.current ||
        !("result" in data) ||
        typeof data.result !== "object" ||
        data.result === null ||
        !("ok" in data.result) ||
        !("message" in data.result) ||
        typeof data.result.message !== "string"
      ) {
        return;
      }

      const result = data.result as BookingMessage["result"];
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setSubmitting(false);

      if (!result.ok) {
        setBookingError(result.message);
        if (result.code === "date-taken") setRefreshKey((value) => value + 1);
        return;
      }

      setBookingError("");
      setBookingMessage(result.message);
      if (result.eventDate) {
        setDates((current) => [
          ...current.filter((entry) => entry.date !== result.eventDate),
          { date: result.eventDate as string, status: "penuh" },
        ]);
      }
    };

    window.addEventListener("message", handleBookingMessage);
    return () => {
      window.removeEventListener("message", handleBookingMessage);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

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
  const minDate = todayDate();

  function fillDemoData() {
    const form = formRef.current;
    if (!form) return;

    const setValue = (name: string, value: string) => {
      const field = form.elements.namedItem(name);
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.value = value;
      }
    };

    const sampleDate = new Date();
    sampleDate.setMonth(sampleDate.getMonth() + 3);
    const date = `${sampleDate.getFullYear()}-${String(sampleDate.getMonth() + 1).padStart(2, "0")}-${String(sampleDate.getDate()).padStart(2, "0")}`;

    setValue("name", "Aina Rahman");
    setValue("whatsapp", "+60 12 345 6789");
    setValue("email", "aina.rahman@example.com");
    setValue("eventTypeOther", "");
    setValue("eventTime", "11:00pg - 3:00ptg");
    setValue("guestCount", "300");
    setValue("venue", "Dewan Seri Putra, Bangi");
    setValue("serviceOther", "");
    setValue("theme", "Garden glam");
    setValue("budget", "RM 20,000");
    setValue("depositAmount", "1000");
    setValue("remainingBalance", "4000");
    setSelectedDate(date);
    setBookingError("");

    form.querySelectorAll<HTMLInputElement>('input[name="services"]').forEach((input) => {
      input.checked = ["Event Coordinator", "Emcee", "Event Planner"].includes(input.value);
    });
    form.querySelectorAll<HTMLInputElement>('input[name="eventType"]').forEach((input) => {
      input.checked = input.value === "Nikah + Sanding";
    });
    const consent = form.elements.namedItem("consent");
    if (consent instanceof HTMLInputElement) consent.checked = true;
    form.querySelectorAll<HTMLInputElement>('input[name="terms"]').forEach((input) => {
      input.checked = true;
    });
    if (proofInputRef.current) proofInputRef.current.value = "";
    setProofFileName("");
    if (proofDataInputRef.current) proofDataInputRef.current.value = "";
    if (proofTypeInputRef.current) proofTypeInputRef.current.value = "";
    if (proofNameInputRef.current) proofNameInputRef.current.value = "";
    setStep(1);
    updateTicketDetails();
  }

  function advanceStep() {
    setBookingError("");
    setBookingMessage("");
    const form = formRef.current;
    if (!form) return false;

    const values = new FormData(form);
    const value = (name: string) => String(values.get(name) ?? "").trim();

    if (step === 1 && !selectedDate) {
      setBookingError("Sila pilih tarikh majlis dahulu.");
      return false;
    }

    if (step === 2) {
      if (!value("eventType")) {
        setBookingError("Sila pilih jenis majlis.");
        return false;
      }
      if (value("eventType") === "Lain-lain" && value("eventTypeOther").length < 2) {
        setBookingError("Nyatakan jenis majlis lain.");
        return false;
      }
      if (value("eventTime").length < 3) {
        setBookingError("Masukkan masa majlis.");
        return false;
      }
      if (value("venue").length < 2) {
        setBookingError("Sila isi lokasi majlis.");
        return false;
      }
      if (!/^\d{1,4}$/.test(value("guestCount")) || Number(value("guestCount")) < 1) {
        setBookingError("Jumlah pax tidak sah.");
        return false;
      }
    }

    if (step === 3) {
      const services = values.getAll("services").map(String);
      if (!services.length) {
        setBookingError("Pilih sekurang-kurangnya satu servis.");
        return false;
      }
      if (services.includes("Lain-lain") && value("serviceOther").length < 2) {
        setBookingError("Nyatakan servis lain.");
        return false;
      }
    }

    if (step === 4) {
      if (value("name").length < 2) {
        setBookingError("Sila isi nama penuh.");
        return false;
      }
      const phone = value("whatsapp");
      if (!/^[+()\d\s-]{8,24}$/.test(phone) || phone.replace(/\D/g, "").length < 8) {
        setBookingError("No. telefon / WhatsApp tidak sah.");
        return false;
      }
      const email = value("email");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setBookingError("Masukkan alamat e-mel yang sah.");
        return false;
      }
    }

    if (step === 5) {
      if (!/^\d{1,8}(\.\d{1,2})?$/.test(value("depositAmount")) || Number(value("depositAmount")) <= 0) {
        setBookingError("Masukkan jumlah deposit yang sah.");
        return false;
      }
      if (!/^\d{1,8}(\.\d{1,2})?$/.test(value("remainingBalance"))) {
        setBookingError("Masukkan jumlah baki yang sah.");
        return false;
      }
      if (values.get("consent") !== "yes") {
        setBookingError("Sila setujui penggunaan maklumat untuk urusan tempahan.");
        return false;
      }
      const terms = values.getAll("terms").map(String);
      if (
        !terms.includes("event-details-accurate") ||
        !terms.includes("payment-terms-accepted")
      ) {
        setBookingError("Sila setujui kedua-dua terma dan syarat.");
        return false;
      }
      const proofFile = proofInputRef.current?.files?.[0];
      if (proofFile && proofFile.size > 10 * 1024 * 1024) {
        setBookingError("Bukti pembayaran mestilah 10 MB atau lebih kecil.");
        return false;
      }
      if (proofFile && !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(proofFile.type)) {
        setBookingError("Muat naik bukti pembayaran dalam format JPG, PNG, GIF atau WebP.");
        return false;
      }
    }

    if (step < 5) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return true;
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    if (step < 5) {
      event.preventDefault();
      advanceStep();
      return;
    }

    if (!advanceStep()) {
      event.preventDefault();
      return;
    }

    setBookingMessage("");
    setBookingError("");

    if (preparedSubmitRef.current) {
      preparedSubmitRef.current = false;
      timeoutRef.current = window.setTimeout(() => {
        setSubmitting(false);
        setBookingError("Tempahan belum dapat disahkan. Sila cuba lagi atau hubungi kami.");
      }, 90000);
      return;
    }

    event.preventDefault();
    if (!bookingEndpoint || !selectedDate) {
      setBookingError(
        bookingEndpoint
          ? "Pilih tarikh majlis pada kalendar dahulu."
          : "Borang tempahan belum disambungkan. Hubungi kami melalui WhatsApp.",
      );
      return;
    }

    setSubmitting(true);

    const form = event.currentTarget;
    const selectedServices = form.querySelectorAll<HTMLInputElement>('input[name="services"]:checked');
    if (selectedServices.length === 0) {
      setSubmitting(false);
      setBookingError("Pilih sekurang-kurangnya satu servis.");
      return;
    }
    const eventType = form.elements.namedItem("eventType");
    const eventTypeOther = form.elements.namedItem("eventTypeOther");
    if (
      eventType instanceof HTMLSelectElement &&
      eventType.value === "Lain-lain" &&
      eventTypeOther instanceof HTMLInputElement &&
      eventTypeOther.value.trim().length < 2
    ) {
      setSubmitting(false);
      setBookingError("Nyatakan jenis majlis lain.");
      return;
    }
    const selectedServiceValues = Array.from(selectedServices, (input) => input.value);
    const serviceOther = form.elements.namedItem("serviceOther");
    if (
      selectedServiceValues.includes("Lain-lain") &&
      serviceOther instanceof HTMLInputElement &&
      serviceOther.value.trim().length < 2
    ) {
      setSubmitting(false);
      setBookingError("Nyatakan servis lain.");
      return;
    }

    const proofFile = proofInputRef.current?.files?.[0];
    if (proofFile && proofFile.size > 10 * 1024 * 1024) {
      setSubmitting(false);
      setBookingError("Bukti pembayaran mestilah 10 MB atau lebih kecil.");
      return;
    }
    if (proofFile && !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(proofFile.type)) {
      setSubmitting(false);
      setBookingError("Muat naik bukti pembayaran dalam format JPG, PNG, GIF atau WebP.");
      return;
    }

    const submitPreparedForm = () => {
      if (requestIdInputRef.current) requestIdInputRef.current.value = window.crypto.randomUUID();
      requestIdRef.current = requestIdInputRef.current?.value ?? "";
      preparedSubmitRef.current = true;
      form.requestSubmit();
    };

    if (!proofFile) {
      submitPreparedForm();
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setSubmitting(false);
      setBookingError("Bukti pembayaran tidak dapat dibaca. Cuba pilih fail lain.");
    };
    reader.onload = () => {
      if (
        typeof reader.result !== "string" ||
        !reader.result.startsWith("data:") ||
        !proofDataInputRef.current ||
        !proofTypeInputRef.current ||
        !proofNameInputRef.current
      ) {
        setSubmitting(false);
        setBookingError("Bukti pembayaran tidak dapat dibaca. Cuba pilih fail lain.");
        return;
      }

      proofDataInputRef.current.value = reader.result.slice(reader.result.indexOf(",") + 1)
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      proofTypeInputRef.current.value = proofFile.type;
      proofNameInputRef.current.value = proofFile.name;
      submitPreparedForm();
    };
    reader.readAsDataURL(proofFile);
  }

  function adjustGuestCount(amount: number) {
    const input = formRef.current?.elements.namedItem("guestCount");
    if (!(input instanceof HTMLInputElement)) return;
    input.value = String(Math.max(1, (Number(input.value) || 0) + amount));
    updateTicketDetails();
  }

  function setGuestCount(value: number) {
    const input = formRef.current?.elements.namedItem("guestCount");
    if (!(input instanceof HTMLInputElement)) return;
    input.value = String(value);
    updateTicketDetails();
  }

  function resetBooking() {
    formRef.current?.reset();
    setBookingMessage("");
    setBookingError("");
    setSelectedDate("");
    setTicketDetails(emptyTicketDetails);
    setProofFileName("");
    setStep(1);
  }

  function previousStep() {
    setBookingError("");
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="booking-page">
      <div className="booking-page__wrap">
        <header className="booking-page__header">
          <Link className="booking-page__logo" href="/">
            SenangPlanner<i aria-hidden="true" />
          </Link>
          <Link className="booking-page__home-link" href="/">← Laman utama</Link>
        </header>

        <section className="booking-page__intro">
          <p className="booking-page__eyebrow">SENANGPLANNER · EVENT PASS</p>
          <h1>Tempah majlis. <em>Macam beli tiket.</em></h1>
          <p className="booking-page__lead">
            Pilih tarikh, lengkapkan butiran dan sahkan bayaran. Satu borang, lima langkah, siap.
          </p>
        </section>

        {bookingMessage ? (
          <section className="booking-success" role="status">
            <div className="booking-success__card">
              <p className="booking-page__eyebrow">TEMPAHAN DISAHKAN</p>
              <h2>Pass anda <em>dah sedia.</em></h2>
              <p>{bookingMessage}</p>
              <p className="booking-success__code">{ticketCode}</p>
              <button className="booking-wizard__button" type="button" onClick={resetBooking}>
                Tempah semula
              </button>
              <Link className="booking-wizard__button booking-wizard__button--ghost" href="/">
                Kembali ke laman utama
              </Link>
            </div>
          </section>
        ) : (
          <div className="booking-page__grid">
            <div className="booking-page__form-column">
              <div
                className="booking-wizard__steps"
                role="progressbar"
                aria-label={`Langkah ${step} daripada 5`}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={step}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <span className={index < step ? "is-active" : ""} key={index} />
                ))}
              </div>

              <form
                ref={formRef}
                id="booking-form"
                className="booking-wizard__card"
                action={bookingEndpoint || undefined}
                method="post"
                target="booking-result-frame"
                noValidate
                onInput={() => {
                  setBookingError("");
                  updateTicketDetails();
                }}
                onChange={() => {
                  setBookingError("");
                  updateTicketDetails();
                }}
                onSubmit={submitBooking}
              >
                <input type="hidden" name="eventDate" value={selectedDate} readOnly />
                <input ref={proofDataInputRef} type="hidden" name="proofData" />
                <input ref={proofTypeInputRef} type="hidden" name="proofType" />
                <input ref={proofNameInputRef} type="hidden" name="proofName" />
                <input ref={requestIdInputRef} type="hidden" name="requestId" />
                <input type="hidden" name="action" value="book" />

                <section className={`booking-wizard__panel${step === 1 ? " is-active" : ""}`} aria-hidden={step !== 1}>
                  <h2>Pilih tarikh</h2>
                  <p className="booking-wizard__sub">Semak slot kosong untuk majlis anda.</p>
                  <div className="booking-wizard__calendar-head">
                    <button
                      className="booking-wizard__arrow"
                      type="button"
                      disabled={month <= currentMonth()}
                      onClick={() => setMonth((value) => shiftMonth(value, -1))}
                      aria-label="Bulan sebelum"
                    >
                      ←
                    </button>
                    <strong>{title}</strong>
                    <button
                      className="booking-wizard__arrow"
                      type="button"
                      onClick={() => setMonth((value) => shiftMonth(value, 1))}
                      aria-label="Bulan seterusnya"
                    >
                      →
                    </button>
                  </div>
                  <div className="booking-wizard__calendar" role="grid" aria-label={`Tarikh ${title}`}>
                    {weekDays.map((day) => <span key={day}>{day}</span>)}
                    {cells.map((day, index) => {
                      if (!day) return <i className="booking-wizard__empty-day" key={`empty-${index}`} />;
                      const date = `${month}-${String(day).padStart(2, "0")}`;
                      const entry = statusByDate.get(date);
                      const status: AvailabilityStatus = entry?.status ?? "kosong";
                      const isFull = status === "penuh";
                      const isPast = date < minDate;
                      return (
                        <button
                          className={[
                            "booking-wizard__day",
                            status === "hampir-penuh" ? "is-few" : "",
                            isFull ? "is-full" : "",
                            selectedDate === date ? "is-selected" : "",
                          ].filter(Boolean).join(" ")}
                          type="button"
                          key={date}
                          disabled={isFull || isPast || loading || Boolean(error)}
                          aria-label={`${day} ${title}${entry?.note ? `: ${entry.note}` : ""}${isFull ? ", penuh" : ""}`}
                          aria-pressed={selectedDate === date}
                          onClick={() => {
                            setSelectedDate(date);
                            setBookingError("");
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <div className="booking-wizard__legend">
                    <span><i /> Kosong</span>
                    <span><i className="is-few" /> Hampir penuh</span>
                    <span><i className="is-full" /> Penuh</span>
                  </div>
                  <p className="booking-wizard__sub booking-wizard__notice">
                    {loading
                      ? "Memuatkan tarikh…"
                      : error
                        ? error
                        : source === "sheet"
                          ? "Live availability · slot yang ditempah ditandakan penuh."
                            : "Kalendar demo. Slot sebenar disahkan oleh pasukan kami."}
                  </p>
                  {error && <p className="booking-wizard__error" role="alert">{error}</p>}
                </section>

                <section className={`booking-wizard__panel${step === 2 ? " is-active" : ""}`} aria-hidden={step !== 2}>
                  <h2>Majlis anda</h2>
                  <p className="booking-wizard__sub">Beritahu kami jenis dan skala majlis.</p>
                  <fieldset className="booking-wizard__field-group">
                    <legend>Jenis majlis</legend>
                    <div className="booking-wizard__tiles">
                      {eventTypes.map((type, index) => (
                        <label className="booking-wizard__tile" key={type}>
                          <input type="radio" name="eventType" value={type} onChange={updateTicketDetails} />
                          <span className="booking-wizard__tile-number">{String(index + 1).padStart(2, "0")}</span>
                          <span className="booking-wizard__tile-title">{type}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className={`booking-wizard__label${ticketDetails.eventType === "Lain-lain" ? "" : " is-hidden"}`}>
                    Nyatakan jenis majlis <small>jika lain-lain</small>
                    <input name="eventTypeOther" maxLength={100} placeholder="Jenis majlis" />
                  </label>
                  <div className="booking-wizard__two">
                    <label className="booking-wizard__label">
                      Masa majlis <small>wajib</small>
                      <input name="eventTime" placeholder="Contoh: 11:00pg - 3:00ptg" minLength={3} maxLength={80} />
                    </label>
                    <label className="booking-wizard__label">
                      Hari
                      <input
                        value={selectedDate ? new Intl.DateTimeFormat("ms-MY", { weekday: "long" }).format(new Date(`${selectedDate}T12:00:00`)) : ""}
                        placeholder="Dipilih daripada tarikh"
                        readOnly
                      />
                    </label>
                  </div>
                  <label className="booking-wizard__label">
                    Lokasi / tempat
                    <input name="venue" maxLength={160} placeholder="Contoh: Dewan Seri Putra, Bangi" />
                  </label>
                  <label className="booking-wizard__label">
                    Jumlah pax
                    <div className="booking-wizard__stepper">
                      <button className="booking-wizard__arrow" type="button" onClick={() => adjustGuestCount(-10)} aria-label="Kurangkan pax">−</button>
                      <input name="guestCount" type="number" min="1" max="9999" defaultValue="100" />
                      <button className="booking-wizard__arrow" type="button" onClick={() => adjustGuestCount(10)} aria-label="Tambah pax">+</button>
                    </div>
                    <span className="booking-wizard__chips">
                      {[50, 100, 300, 500].map((count) => (
                        <button type="button" key={count} onClick={() => setGuestCount(count)}>{count}</button>
                      ))}
                    </span>
                  </label>
                </section>

                <section className={`booking-wizard__panel${step === 3 ? " is-active" : ""}`} aria-hidden={step !== 3}>
                  <h2>Servis pilihan</h2>
                  <p className="booking-wizard__sub">Pilih sekurang-kurangnya satu.</p>
                  <fieldset className="booking-wizard__field-group">
                    <legend>Servis pilihan</legend>
                    <div className="booking-wizard__tiles">
                      {serviceOptions.map((service, index) => (
                        <label className="booking-wizard__tile" key={service}>
                          <input type="checkbox" name="services" value={service} onChange={updateTicketDetails} />
                          <span className="booking-wizard__tile-number">{String(index + 1).padStart(2, "0")}</span>
                          <span className="booking-wizard__tile-title">{service}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className={`booking-wizard__label${ticketDetails.services.includes("Lain-lain") ? "" : " is-hidden"}`}>
                    Nyatakan servis lain <small>pilihan</small>
                    <input name="serviceOther" maxLength={100} placeholder="Servis tambahan" />
                  </label>
                  <div className="booking-wizard__two">
                    <label className="booking-wizard__label">
                      Tema / konsep <small>pilihan</small>
                      <input name="theme" maxLength={200} placeholder="Contoh: Garden glam" />
                    </label>
                    <label className="booking-wizard__label">
                      Bajet <small>pilihan</small>
                      <input name="budget" maxLength={100} placeholder="Contoh: RM 20,000" />
                    </label>
                  </div>
                  <label className="booking-wizard__label">
                    Nota tambahan <small>pilihan</small>
                    <textarea name="notes" rows={3} maxLength={500} placeholder="Apa-apa maklumat lain yang kami patut tahu." />
                  </label>
                </section>

                <section className={`booking-wizard__panel${step === 4 ? " is-active" : ""}`} aria-hidden={step !== 4}>
                  <h2>Pemilik pass</h2>
                  <p className="booking-wizard__sub">Supaya kami tahu siapa nak dihubungi.</p>
                  <label className="booking-wizard__label">
                    Nama penuh
                    <input name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Contoh: Aina Rahman" />
                  </label>
                  <div className="booking-wizard__two">
                    <label className="booking-wizard__label">
                      No. telefon / WhatsApp
                      <input name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" minLength={8} maxLength={24} placeholder="+60 12 345 6789" />
                    </label>
                    <label className="booking-wizard__label">
                      E-mel <small>pilihan</small>
                      <input name="email" type="email" autoComplete="email" maxLength={254} placeholder="aina@email.com" />
                    </label>
                  </div>
                </section>

                <section className={`booking-wizard__panel${step === 5 ? " is-active" : ""}`} aria-hidden={step !== 5}>
                  <h2>Pengesahan &amp; bayaran</h2>
                  <p className="booking-wizard__sub">Langkah terakhir. Hampir siap.</p>
                  <div className="booking-wizard__two">
                    <label className="booking-wizard__label">
                      Total bayaran deposit (RM)
                      <input name="depositAmount" type="number" min="0.01" max="99999999" step="0.01" placeholder="Contoh: 1000" />
                    </label>
                    <label className="booking-wizard__label">
                      Baki selepas deposit (RM)
                      <input name="remainingBalance" type="number" min="0" max="99999999" step="0.01" placeholder="Contoh: 4000" />
                    </label>
                  </div>
                  <label className="booking-wizard__label">
                    Bukti pembayaran deposit <small>pilihan · imej maksimum 10 MB</small>
                    <span className="booking-wizard__upload">
                      {proofFileName || "Tekan untuk pilih imej resit"}
                      <input
                        ref={proofInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={(event) => setProofFileName(event.target.files?.[0]?.name ?? "")}
                      />
                    </span>
                  </label>
                  <p className="booking-wizard__sub">
                    Sila buat bayaran mengikut maklumat akaun yang diberikan oleh pasukan SenangPlanner.
                  </p>
                  <details className="booking-wizard__terms">
                    <summary>Baca ringkasan terma &amp; syarat</summary>
                    <ul>
                      <li>Deposit tidak dikembalikan jika pelanggan membatalkan tempahan. Jika SenangPlanner membatalkan, deposit dipulangkan.</li>
                      <li>Baki bayaran perlu dijelaskan mengikut tarikh yang dipersetujui dalam invois atau kontrak.</li>
                      <li>Perubahan tarikh atau lokasi perlu dimaklumkan sekurang-kurangnya sebulan lebih awal dan tertakluk pada ketersediaan. Lokasi di luar KL dan Selangor mungkin dikenakan caj perjalanan.</li>
                      <li>Caj perjalanan untuk majlis atau raptai dan penginapan, jika perlu, dimaklumkan berasingan.</li>
                      <li>Tempoh servis maksimum ialah empat jam; masa tambahan dikenakan RM50 sejam. Lanjutan masa perlu dimaklumkan semasa majlis.</li>
                      <li>Pelanggan bertanggungjawab menyediakan mikrofon, sistem audio yang berfungsi dan keperluan logistik. Penggunaan peralatan audio SenangPlanner boleh dikenakan caj tambahan.</li>
                      <li>SenangPlanner tidak bertanggungjawab atas kerosakan atau kehilangan peralatan milik pihak lain.</li>
                      <li>Skrip emcee mengikut tema yang dipersetujui. Perubahan besar selepas persetujuan awal mungkin dikenakan caj tambahan.</li>
                    </ul>
                    <p>Terma penuh dan jadual pembayaran perlu disahkan sebelum borang ini diterbitkan.</p>
                  </details>
                  <label className="booking-wizard__check">
                    <input name="consent" type="checkbox" value="yes" />
                    <span>Saya bersetuju maklumat ini digunakan untuk mengurus tempahan dan bayaran saya.</span>
                  </label>
                  <label className="booking-wizard__check">
                    <input name="terms" type="checkbox" value="event-details-accurate" />
                    <span>Saya mengesahkan butiran majlis yang diberi adalah benar.</span>
                  </label>
                  <label className="booking-wizard__check">
                    <input name="terms" type="checkbox" value="payment-terms-accepted" />
                    <span>Saya telah membaca dan bersetuju dengan terma bayaran, pembatalan, perubahan tarikh/lokasi dan durasi servis.</span>
                  </label>
                  <label className="booking-wizard__honeypot" aria-hidden="true" tabIndex={-1}>
                    Website
                    <input name="website" autoComplete="off" tabIndex={-1} />
                  </label>
                </section>

                {bookingError && <p className="booking-wizard__error" role="alert">{bookingError}</p>}
                {process.env.NODE_ENV === "development" && (
                  <div className="booking-wizard__demo">
                    <button type="button" onClick={fillDemoData}>Isi contoh (demo)</button>
                    <span>Contoh ini hanya mengisi borang dan tidak dihantar.</span>
                  </div>
                )}
              </form>
            </div>

            <aside className="booking-page__aside">
              <div className="booking-ticket" aria-live="polite">
                <div className="booking-ticket__top">
                  <div className="booking-ticket__label">
                    <span>SenangPlanner · Event Pass</span>
                    <span>{submitting ? "Sending" : "Preview"}</span>
                  </div>
                  <h2>
                    {selectedDate
                      ? <>{new Date(`${selectedDate}T12:00:00`).getDate()} {monthNames[new Date(`${selectedDate}T12:00:00`).getMonth()]} <em>{new Date(`${selectedDate}T12:00:00`).getFullYear()}</em></>
                      : <>Pilih tarikh <em>dulu.</em></>}
                  </h2>
                  <p>{ticketDetails.name ? `Pass untuk ${ticketDetails.name}` : "One day, your big story"}</p>
                </div>
                <div className="booking-ticket__cut" />
                <div className="booking-ticket__bottom">
                  <div className="booking-ticket__rows">
                    <div><small>Hari</small><strong>{selectedDate ? formatSelectedDate(selectedDate).split(",")[0] : "—"}</strong></div>
                    <div><small>Masa</small><strong>{ticketDetails.eventTime || "—"}</strong></div>
                    <div><small>Jenis</small><strong>{ticketType || "—"}</strong></div>
                    <div><small>Pax</small><strong>{ticketDetails.guestCount ? `${ticketDetails.guestCount} pax` : "—"}</strong></div>
                    <div className="booking-ticket__wide"><small>Lokasi</small><strong>{ticketDetails.venue || "—"}</strong></div>
                    <div className="booking-ticket__wide"><small>Servis</small><strong>{ticketServices || "—"}</strong></div>
                  </div>
                  <div className="booking-ticket__bars" aria-hidden="true">
                    {ticketBars.map((width, index) => <i style={{ width }} key={index} />)}
                  </div>
                  <p className="booking-ticket__code">{ticketCode}</p>
                </div>
              </div>
              <p className="booking-page__aside-note">Ringkasan ini akan dikemas kini bila anda isi butiran.</p>
            </aside>
          </div>
        )}
      </div>

      {!bookingMessage && (
        <div className="booking-page__bar">
          <div>
            <p><strong>Langkah {step} / 5</strong><span>{["Pilih tarikh", "Majlis anda", "Servis pilihan", "Pemilik pass", "Pengesahan & bayaran"][step - 1]}</span></p>
            <div className="booking-page__bar-actions">
              {step > 1 && (
                <button className="booking-wizard__button booking-wizard__button--ghost" type="button" onClick={previousStep}>
                  Kembali
                </button>
              )}
              {step < 5 ? (
                <button className="booking-wizard__button" type="button" onClick={advanceStep}>Seterusnya</button>
              ) : (
                <button
                  className="booking-wizard__button"
                  type="submit"
                  form="booking-form"
                  disabled={!bookingEndpoint || submitting}
                >
                  {submitting ? "Sedang hantar..." : bookingEndpoint ? "Confirm & Tempah" : "Tempahan belum disambungkan"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <iframe
        ref={frameRef}
        className="booking-wizard__response"
        name="booking-result-frame"
        title="Booking response"
      />
    </main>
  );
}
