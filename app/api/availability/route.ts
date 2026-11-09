import { NextRequest, NextResponse } from "next/server";
import { availabilityFallback } from "@/data/availability";
import {
  getAvailabilityForMonth,
  parseAvailabilityCsv,
} from "@/lib/availability";

export const revalidate = 300;

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json(
      { error: "Provide month in YYYY-MM format." },
      { status: 400 },
    );
  }

  const csvUrl = process.env.AVAILABILITY_CSV_URL;
  if (!csvUrl) {
    return NextResponse.json({
      month,
      dates: getAvailabilityForMonth(availabilityFallback, month),
      source: "fallback",
    });
  }

  try {
    const response = await fetch(csvUrl, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      throw new Error(`Availability sheet returned ${response.status}.`);
    }

    const dates = parseAvailabilityCsv(await response.text());
    return NextResponse.json({
      month,
      dates: getAvailabilityForMonth(dates, month),
      source: "sheet",
    });
  } catch (error) {
    console.error("Could not load availability CSV.", error);
    return NextResponse.json(
      { error: "Availability is temporarily unavailable. Please try WhatsApp." },
      { status: 502 },
    );
  }
}
