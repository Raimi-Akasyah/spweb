"use client";

import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function ClosingSection() {
  const { language } = useLanguage();
  const bm = language === "bm";
  const message = bm
    ? "Hi Senang Planners! Saya sedang merancang acara dan ingin mendapatkan sebut harga.\n\nJenis acara:\nTarikh:\nLokasi:\nAnggaran tetamu:"
    : "Hi Senang Planners! I am planning an event and would like a quotation.\n\nEvent type:\nDate:\nVenue:\nEstimated guests:";

  return (
    <section className="cta" id="hubungi">
      <div className="w">
        <div className="cg2">
          <div>
            <h2 className="rv">{bm ? "Apa acara yang anda " : "What event are you "}<span className="ser">{bm ? "rancang?" : "planning?"}</span></h2>
            <p>{bm
              ? "Kongsikan jenis acara, tarikh, lokasi dan anggaran tetamu. Kami akan semak ketersediaan pasukan dan sediakan sebut harga mengikut keperluan anda."
              : "Share your event type, date, venue and estimated guest count. We will check team availability and prepare a quote based on your needs."}</p>
            <WhatsAppButton className="btn bk" variant="dark" message={message}>
              {bm ? "Bincang di WhatsApp" : "Discuss on WhatsApp"} <ArrowUpRight className="i" aria-hidden="true" />
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
