"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";

export function WaysSection() {
  const { language } = useLanguage();
  const bm = language === "bm";
  const pageCards = bm
    ? [
        { className: "h1", label: "01 · Pakej Khas", title: "Senang Wedding Package", description: "Pakej khas untuk nikah dan sanding pada hari yang sama, dengan koordinasi sehingga 8 jam.", link: "/packages", action: "Lihat Pakej" },
        { className: "h2", label: "02 · Tentang Kami", title: "Visi, Misi & Pasukan", description: "Kenali hala tuju dan peranan kru yang memastikan acara berjalan lancar.", link: "/vibe-check", action: "Kenali Pasukan" },
        { className: "h3", label: "03 · Pengalaman Sebenar", title: "Portfolio Acara", description: "Lihat nama acara, jenis acara dan skop tugas yang dijalankan pasukan kami.", link: "/gallery", action: "Lihat Portfolio" },
      ]
    : [
        { className: "h1", label: "01 · Dedicated Package", title: "Senang Wedding Package", description: "A dedicated package for akad nikah and reception on the same day, with coordination for up to 8 hours.", link: "/packages", action: "View Package" },
        { className: "h2", label: "02 · About Us", title: "Vision, Mission & Crew", description: "Meet our direction and the crew roles that keep every event running smoothly.", link: "/vibe-check", action: "Meet the Team" },
        { className: "h3", label: "03 · Real Experience", title: "Event Portfolio", description: "Explore event names, event types and the exact scope handled by our team.", link: "/gallery", action: "View Portfolio" },
      ];
  const serviceLabels = bm
    ? ["Koordinasi", "Pengacara", "Kru", "Audio", "Komunikasi"]
    : ["Coordination", "Emcee", "Crew", "Audio", "Communication"];

  return (
    <>
      <section className="svc" id="servis">
        <div className="w">
          <h2 className="rv">{bm ? "Servis " : "Our "}<span className="ser">{bm ? "Kami." : "Services."}</span></h2>
          <div className="stk">
            {services.map((service, index) => (
              <article
                className={`sc service-card--${index}`}
                style={{ top: `calc(132px + ${index * 14}px)`, zIndex: index + 1 }}
                key={service.number}
              >
                <span className="tab">{service.number} · {serviceLabels[index]}</span>
                <div>
                  <h3>{bm ? service.title : service.titleEn}</h3>
                  <p>{bm ? service.description : service.descriptionEn}</p>
                  <WhatsAppButton
                    className="btn bk"
                    variant="dark"
                    message={bm ? service.message : service.messageEn}
                  >
                    {bm ? "Tanya Perkhidmatan Ini" : "Ask About This Service"} <ArrowUpRight className="i" aria-hidden="true" />
                  </WhatsAppButton>
                </div>
                <div className="service-stamp" aria-hidden="true">
                  <span>Senang Planners · {service.number}</span>
                  <strong>{service.number}</strong>
                  <span>{serviceLabels[index]}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="ways-explore">
        <div className="w">
          <h2 className="rv">{bm ? "Teroka " : "Explore "}<span className="ser mk">{bm ? "lebih lanjut." : "more."}</span></h2>
          <div className="hub">
            {pageCards.map((card) => (
              <article className={`hc ${card.className}`} key={card.link}>
                <div>
                  <span className="ey">{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <Link className="btn bk sm" href={card.link}>
                  {card.action} <ArrowUpRight className="i" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
