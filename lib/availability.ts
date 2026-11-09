export type AvailabilityStatus = "kosong" | "hampir-penuh" | "penuh";

export type AvailabilityDate = {
  date: string;
  status: AvailabilityStatus;
  note?: string;
};

const validStatuses = new Set<AvailabilityStatus>([
  "kosong",
  "hampir-penuh",
  "penuh",
]);

function parseCsvRow(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }

  if (quoted) throw new Error("Availability CSV contains an unclosed quoted field.");
  cells.push(cell.trim());
  return cells;
}

export function parseAvailabilityCsv(csv: string): AvailabilityDate[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCsvRow(lines[0]).map((value) => value.toLowerCase());
  const dateIndex = headers.indexOf("date");
  const statusIndex = headers.indexOf("status");
  const noteIndex = headers.indexOf("note");
  if (dateIndex < 0 || statusIndex < 0) {
    throw new Error("Availability CSV must include date and status columns.");
  }

  return lines.slice(1).flatMap((line, index) => {
    const cells = parseCsvRow(line);
    const date = cells[dateIndex] ?? "";
    const status = (cells[statusIndex] ?? "") as AvailabilityStatus;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !validStatuses.has(status)) {
      throw new Error(`Invalid availability CSV row ${index + 2}.`);
    }
    return [{ date, status, note: noteIndex < 0 ? undefined : cells[noteIndex] }];
  });
}

export function getAvailabilityForMonth(
  entries: AvailabilityDate[],
  month: string,
): AvailabilityDate[] {
  return entries.filter((entry) => entry.date.startsWith(`${month}-`));
}
