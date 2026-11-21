import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking-wizard";

export const metadata: Metadata = {
  title: "Tempah Event Pass · SenangPlanner",
  description: "Pilih tarikh dan lengkapkan tempahan majlis SenangPlanner dalam lima langkah.",
};

export default function BookingPage() {
  return <BookingWizard />;
}
