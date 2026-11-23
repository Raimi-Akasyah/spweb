"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { galleryEvents } from "@/data/gallery";
import { publicAssetPath } from "@/lib/public-asset";
import { useLanguage } from "@/components/language-provider";

export function GalleryPreview() {
  const { language } = useLanguage();
  const bm = language === "bm";

  return (
    <section className="portfolio-preview" id="portfolio">
      <div className="w">
        <div className="section-heading-row">
          <div>
            <p className="ey">{bm ? "Portfolio Acara" : "Event Portfolio"}</p>
            <h2>{bm ? "Acara yang Pernah " : "Events We Have "}<span className="ser mk">{bm ? "Kami Kendalikan" : "Managed"}</span></h2>
          </div>
          <Link className="btn bk sm" href="/gallery">
            {bm ? "Lihat Semua" : "View All"} <ArrowUpRight className="i" aria-hidden="true" />
          </Link>
        </div>
        <div className="event-grid event-grid--preview">
          {galleryEvents.slice(0, 3).map((event) => (
            <article className="event-card" key={event.linkUrl ?? event.image}>
              <div className="fr event-card__image" style={{ aspectRatio: `${event.width} / ${event.height}` }}>
                <Image
                  src={publicAssetPath(event.image)}
                  alt={event.alt}
                  width={event.width}
                  height={event.height}
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <div className="event-card__details">
                <span className="ey">{bm ? event.eventTypeMs : event.eventTypeEn}</span>
                <h3>{event.title.replace(/ · Foto \d+$/, "")}</h3>
                <p>{event.caption.replace(/ · Foto \d+$/, "")}</p>
                {(bm ? event.scopeMs : event.scopeEn) && (
                  <small>{bm ? event.scopeMs : event.scopeEn}</small>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
