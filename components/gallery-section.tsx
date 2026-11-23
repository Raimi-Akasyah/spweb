"use client";

import Image from "next/image";
import { galleryEvents } from "@/data/gallery";
import { publicAssetPath } from "@/lib/public-asset";
import { useLanguage } from "@/components/language-provider";

export function GallerySection() {
  const { language } = useLanguage();
  const bm = language === "bm";

  return (
    <>
      <header className="ph">
        <div className="w">
          <div className="pill">{bm ? "Senang Planners · Portfolio Acara" : "Senang Planners · Event Portfolio"}</div>
          <h1>{bm ? "Acara yang Pernah " : "Events We Have "}<span className="ser mk">{bm ? "Kami Kendalikan" : "Managed"}</span></h1>
          <p className="sub">{bm
            ? "Lihat acara sebenar yang pernah dikendalikan oleh pasukan Senang Planners."
            : "Explore real events handled by the Senang Planners team."}</p>
        </div>
      </header>
      <section className="gallery-section" id="portfolio">
        <div className="w">
          <div className="event-grid">
            {galleryEvents.map((event) => (
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
                  <h2>{event.title.replace(/ · Foto \d+$/, "")}</h2>
                  <p>{event.caption.replace(/ · Foto \d+$/, "")}</p>
                  {(bm ? event.scopeMs : event.scopeEn) && (
                    <small>{bm ? event.scopeMs : event.scopeEn}</small>
                  )}
                  {event.linkUrl && (
                    <a href={event.linkUrl} target="_blank" rel="noopener noreferrer">
                      {bm ? "Lihat hantaran asal" : "View original post"}
                    </a>
                  )}
                  {event.photos.length > 1 && (
                    <span className="event-card__photo-count">
                      {bm ? `${event.photos.length} foto` : `${event.photos.length} photos`}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
