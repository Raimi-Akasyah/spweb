const HEADERS = [
  "Booking ID",
  "Created At",
  "Name",
  "WhatsApp",
  "Event Date",
  "Event Type",
  "Package",
  "Guest Count",
  "Notes",
  "Status",
  "Venue",
  "Consent",
  "Email",
  "Event Day",
  "Event Time",
  "Event Type Other",
  "Services",
  "Service Other",
  "Theme / Concept",
  "Budget",
  "Deposit Amount",
  "Payment Proof URL",
  "Remaining Balance",
  "Terms Accepted",
];
const MAX_PAYMENT_PROOF_BYTES = 10 * 1024 * 1024;
const PAYMENT_PROOF_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const BOOKINGS_SPREADSHEET_ID = "1fBxefY_vrzAwi8JYqa_kwp3-PjppFrwJUe87PmElYVw";

function setup() {
  const spreadsheet = SpreadsheetApp.openById(BOOKINGS_SPREADSHEET_ID);

  PropertiesService.getScriptProperties().setProperty(
    "SPREADSHEET_ID",
    spreadsheet.getId(),
  );
  getBookingsSheet_(spreadsheet);
  getPaymentProofFolder_();
}

function doGet(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const callback = parameters.callback || "";
  if (!/^senangCallback_[A-Za-z0-9_]+$/.test(callback)) {
    return ContentService.createTextOutput("Invalid callback.")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    const month = parameters.month || "";
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      throw new Error("Provide month in YYYY-MM format.");
    }

    const cacheKey = `availability:${month}`;
    let cache = null;
    try {
      cache = CacheService.getScriptCache();
      const cachedEntries = cache.get(cacheKey);
      if (cachedEntries) {
        try {
          return jsonp_(callback, { ok: true, entries: JSON.parse(cachedEntries) });
        } catch (cacheError) {
          console.error(cacheError);
          cache.remove(cacheKey);
        }
      }
    } catch (cacheError) {
      console.error(cacheError);
    }

    const sheet = getBookingsSheet_();
    const lastRow = sheet.getLastRow();
    const rows = lastRow < 2
      ? []
      : sheet.getRange(2, 5, lastRow - 1, 6).getValues();
    const entries = rows.flatMap((row) => {
      const eventDate = normalizeDate_(row[0]);
      if (!eventDate || !eventDate.startsWith(month + "-") || row[5] !== "confirmed") {
        return [];
      }
      return [{ date: eventDate, status: "penuh" }];
    });

    if (cache) {
      try {
        cache.put(cacheKey, JSON.stringify(entries), 300);
      } catch (cacheError) {
        console.error(cacheError);
      }
    }
    return jsonp_(callback, { ok: true, entries: entries });
  } catch (error) {
    console.error(error);
    return jsonp_(callback, { ok: false, error: error.message || "Availability unavailable." });
  }
}

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const parameterLists = event && event.parameters ? event.parameters : {};
  const requestId = String(parameters.requestId || "");

  try {
    if (parameters.website) throw new Error("Please remove the invalid field and try again.");
    const booking = validateBooking_(parameters, parameterLists);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getBookingsSheet_();
      const lastRow = sheet.getLastRow();
      const rows = lastRow < 2
        ? []
        : sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
      const occupied = rows.some((row) =>
        normalizeDate_(row[4]) === booking.eventDate && row[9] === "confirmed",
      );
      if (occupied) {
        return bookingResult_(requestId, {
          ok: false,
          code: "date-taken",
          message: "Maaf, tarikh ini baru sahaja ditempah. Pilih tarikh lain.",
        });
      }

      const proof = booking.proofData
        ? savePaymentProof_(booking)
        : { fileId: "", url: "" };
      const bookingId = Utilities.getUuid();
      try {
        sheet.appendRow([
          bookingId,
          new Date(),
          safeSheetText_(booking.name),
          safeSheetText_(booking.whatsapp),
          booking.eventDate,
          safeSheetText_(booking.eventType),
          safeSheetText_(booking.packageName),
          booking.guestCount,
          safeSheetText_(booking.notes),
          "confirmed",
          safeSheetText_(booking.venue),
          "yes",
          safeSheetText_(booking.email),
          booking.eventDay,
          safeSheetText_(booking.eventTime),
          safeSheetText_(booking.eventTypeOther),
          safeSheetText_(booking.services.join(", ")),
          safeSheetText_(booking.serviceOther),
          safeSheetText_(booking.theme),
          safeSheetText_(booking.budget),
          booking.depositAmount,
          proof.url,
          booking.remainingBalance,
          "yes",
        ]);
      } catch (error) {
        if (proof.fileId) DriveApp.getFileById(proof.fileId).setTrashed(true);
        throw error;
      }

      try {
        cacheConfirmedBooking_(booking.eventDate);
      } catch (cacheError) {
        console.error(cacheError);
      }

      return bookingResult_(requestId, {
        ok: true,
        bookingId: bookingId,
        eventDate: booking.eventDate,
        message: "Tempahan disimpan dalam Google Sheets dan kalendar laman web telah dikemas kini. Pasukan kami akan menghubungi anda.",
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return bookingResult_(requestId, {
      ok: false,
      code: "invalid-or-unavailable",
      message: error.message || "Tempahan tidak berjaya. Sila cuba lagi.",
    });
  }
}

function cacheConfirmedBooking_(eventDate) {
  const month = eventDate.slice(0, 7);
  const cache = CacheService.getScriptCache();
  const cacheKey = `availability:${month}`;
  const cachedEntries = cache.get(cacheKey);
  if (!cachedEntries) return;

  const entries = JSON.parse(cachedEntries);
  if (!entries.some((entry) => entry.date === eventDate)) {
    entries.push({ date: eventDate, status: "penuh" });
  }
  cache.put(cacheKey, JSON.stringify(entries), 300);
}

function validateBooking_(parameters, parameterLists) {
  const name = String(parameters.name || "").trim();
  const whatsapp = String(parameters.whatsapp || "").trim();
  const eventDate = String(parameters.eventDate || "").trim();
  const eventType = String(parameters.eventType || "").trim();
  const eventTypeOther = String(parameters.eventTypeOther || "").trim();
  const eventTime = String(parameters.eventTime || "").trim();
  const packageName = String(parameters.packageName || "").trim();
  const guestCountText = String(parameters.guestCount || "").trim();
  const notes = String(parameters.notes || "").trim();
  const venue = String(parameters.venue || "").trim();
  const email = String(parameters.email || "").trim();
  const serviceOther = String(parameters.serviceOther || "").trim();
  const theme = String(parameters.theme || "").trim();
  const budget = String(parameters.budget || "").trim();
  const depositAmountText = String(parameters.depositAmount || "").trim();
  const remainingBalanceText = String(parameters.remainingBalance || "").trim();
  const services = parameterLists.services
    ? parameterLists.services.map(function (value) { return String(value).trim(); })
    : [];
  const terms = parameterLists.terms
    ? parameterLists.terms.map(function (value) { return String(value).trim(); })
    : [];
  const proofData = String(parameters.proofData || "").trim();
  const proofName = String(parameters.proofName || "").trim();
  const proofType = String(parameters.proofType || "").trim().toLowerCase();

  if (name.length < 2 || name.length > 80) throw new Error("Masukkan nama (2–80 aksara).");
  if (!/^[+()\d\s-]{8,24}$/.test(whatsapp) || whatsapp.replace(/\D/g, "").length < 8) {
    throw new Error("Masukkan nombor WhatsApp yang sah.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) throw new Error("Pilih tarikh majlis yang sah.");

  const date = new Date(eventDate + "T00:00:00Z");
  if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== eventDate) {
    throw new Error("Tarikh majlis tidak sah.");
  }
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  if (eventDate < today) throw new Error("Pilih tarikh hari ini atau tarikh akan datang.");

  const allowedTypes = ["Nikah", "Sanding", "Nikah + Sanding", "Majlis Hari Jadi", "Lain-lain"];
  if (allowedTypes.indexOf(eventType) === -1) throw new Error("Pilih jenis majlis.");
  if (eventType === "Lain-lain" && (eventTypeOther.length < 2 || eventTypeOther.length > 100)) {
    throw new Error("Nyatakan jenis majlis lain (2–100 aksara).");
  }
  if (eventTime.length < 3 || eventTime.length > 80) throw new Error("Masukkan masa majlis.");
  if (packageName !== "Senang Wedding Package 2027") throw new Error("Pilih Senang Wedding Package 2027.");
  if (!/^\d{1,4}$/.test(guestCountText) || Number(guestCountText) < 1) {
    throw new Error("Bilangan tetamu tidak sah.");
  }
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error("Masukkan alamat e-mel yang sah.");
  }
  if (notes.length > 500) throw new Error("Nota mestilah kurang daripada 500 aksara.");
  if (venue.length < 2 || venue.length > 160) throw new Error("Masukkan lokasi majlis (2–160 aksara).");
  const allowedServices = [
    "Emcee",
    "Wedding Coordinator",
    "Floor Manager",
    "Crew",
    "Bride Assistant",
    "PA System + Audioman",
    "Lain-lain",
  ];
  if (!services.length || services.some(function (service) {
    return allowedServices.indexOf(service) === -1;
  })) {
    throw new Error("Pilih sekurang-kurangnya satu servis.");
  }
  if (services.indexOf("Lain-lain") !== -1 && (serviceOther.length < 2 || serviceOther.length > 100)) {
    throw new Error("Nyatakan servis lain (2–100 aksara).");
  }
  if (theme.length > 200) throw new Error("Tema mestilah kurang daripada 200 aksara.");
  if (budget.length > 100) throw new Error("Bajet mestilah kurang daripada 100 aksara.");
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(depositAmountText) || Number(depositAmountText) <= 0) {
    throw new Error("Masukkan jumlah deposit yang sah.");
  }
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(remainingBalanceText)) {
    throw new Error("Masukkan jumlah baki yang sah.");
  }
  if (parameters.consent !== "yes") throw new Error("Sila setujui penggunaan maklumat untuk urusan tempahan.");
  if (
    terms.indexOf("event-details-accurate") === -1 ||
    terms.indexOf("payment-terms-accepted") === -1
  ) {
    throw new Error("Sila setujui kedua-dua terma dan syarat.");
  }
  if (proofData) {
    if (proofData.length > Math.ceil(MAX_PAYMENT_PROOF_BYTES / 3) * 4 + 8) {
      throw new Error("Bukti pembayaran mestilah 10 MB atau lebih kecil.");
    }
    if (PAYMENT_PROOF_TYPES.indexOf(proofType) === -1) {
      throw new Error("Muat naik bukti pembayaran dalam format JPG, PNG, GIF atau WebP.");
    }
    if (!proofName || proofName.length > 120) throw new Error("Nama fail bukti pembayaran tidak sah.");
  }
  if (!proofData && (proofName || proofType)) {
    throw new Error("Data fail bukti pembayaran tidak lengkap.");
  }

  return {
    name: name,
    whatsapp: whatsapp,
    eventDate: eventDate,
    eventDay: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"][
      new Date(eventDate + "T00:00:00Z").getUTCDay()
    ],
    eventType: eventType,
    eventTypeOther: eventTypeOther,
    eventTime: eventTime,
    packageName: packageName,
    guestCount: guestCountText ? Number(guestCountText) : "",
    notes: notes,
    venue: venue,
    email: email,
    services: services,
    serviceOther: serviceOther,
    theme: theme,
    budget: budget,
    depositAmount: Number(depositAmountText),
    remainingBalance: Number(remainingBalanceText),
    proofData: proofData,
    proofName: proofName,
    proofType: proofType,
  };
}

function savePaymentProof_(booking) {
  const bytes = Utilities.base64DecodeWebSafe(booking.proofData);
  if (!bytes.length || bytes.length > MAX_PAYMENT_PROOF_BYTES) {
    throw new Error("Bukti pembayaran mestilah 10 MB atau lebih kecil.");
  }
  if (!isValidPaymentImage_(bytes, booking.proofType)) {
    throw new Error("Fail bukti pembayaran bukan imej yang sah.");
  }

  const safeName = booking.proofName.replace(/[^\w.-]/g, "_").slice(0, 100);
  const blob = Utilities.newBlob(
    bytes,
    booking.proofType,
    Utilities.getUuid() + "-" + safeName,
  );
  const file = getPaymentProofFolder_().createFile(blob);
  return { fileId: file.getId(), url: file.getUrl() };
}

function isValidPaymentImage_(bytes, mimeType) {
  const byteAt = function (index) { return (bytes[index] + 256) % 256; };
  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 && byteAt(0) === 0xff && byteAt(1) === 0xd8 && byteAt(2) === 0xff;
  }
  if (mimeType === "image/png") {
    return bytes.length >= 8 &&
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(function (value, index) {
        return byteAt(index) === value;
      });
  }
  if (mimeType === "image/gif") {
    return bytes.length >= 6 &&
      String.fromCharCode.apply(null, bytes.slice(0, 6)) === "GIF8" + String.fromCharCode(byteAt(4), byteAt(5));
  }
  if (mimeType === "image/webp") {
    return bytes.length >= 12 &&
      String.fromCharCode.apply(null, bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode.apply(null, bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

function getPaymentProofFolder_() {
  const properties = PropertiesService.getScriptProperties();
  const folderId = properties.getProperty("PAYMENT_PROOFS_FOLDER_ID");
  if (folderId) return DriveApp.getFolderById(folderId);

  const folder = DriveApp.createFolder("SenangPlanner Payment Proofs");
  properties.setProperty("PAYMENT_PROOFS_FOLDER_ID", folder.getId());
  return folder;
}

function safeSheetText_(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function getBookingsSheet_(spreadsheet) {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  const book = spreadsheet || (id ? SpreadsheetApp.openById(id) : null);
  if (!book) throw new Error("Run setup() from the bookings spreadsheet first.");

  let sheet = book.getSheetByName("Bookings");
  if (!sheet) sheet = book.insertSheet("Bookings");
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  } else {
    const lastColumn = sheet.getLastColumn();
    const existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
    const missingHeaders = HEADERS.filter((header) => existingHeaders.indexOf(header) === -1);
    if (missingHeaders.length) {
      sheet.getRange(1, lastColumn + 1, 1, missingHeaders.length).setValues([missingHeaders]);
    }
  }
  return sheet;
}

function normalizeDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function jsonp_(callback, data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return ContentService.createTextOutput(callback + "(" + json + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function bookingResult_(requestId, result) {
  const payload = JSON.stringify({
    type: "senangplanner-booking-result",
    requestId: requestId,
    result: result,
  }).replace(/</g, "\\u003c");
  const html = HtmlService.createHtmlOutput(
    "<!doctype html><meta charset=\"utf-8\"><script>window.parent.postMessage(" +
      payload +
      ", \"*\");</script>",
  );
  html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}
