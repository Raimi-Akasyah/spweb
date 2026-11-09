"use client";

import { useState } from "react";
import { gallery, highlightEmbedUrl } from "@/data/gallery";
import { PhotoPlaceholder } from "@/components/photo-placeholder";

export function GallerySection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="gallery section-shell" id="gallery">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Cerita yang telah kami raikan</p>
          <h2>Media Gallery</h2>
        </div>
        <p>Detik sebenar, daripada majlis sebenar — dikongsi dengan izin.</p>
      </div>
      <div className="gallery-grid">
        {gallery.map((item, index) => (
          <article className={`gallery-item gallery-item--${index + 1}`} key={`${item.title}-${index}`}>
            <PhotoPlaceholder label={`Galeri acara ${index + 1}`} aspect="wide" src={item.image || undefined} alt={item.title} />
            <div className="gallery-item__caption">
              <div><h3>{item.title}</h3><p>{item.caption}</p></div>
              {item.reelUrl ? (
                <a href={item.reelUrl} target="_blank" rel="noreferrer">Tonton reel <span aria-hidden="true">↗</span></a>
              ) : (
                <span className="gallery-item__pending">Pautan reel akan ditambah</span>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="highlight-reel">
        <div className="highlight-reel__title">
          <p className="eyebrow">Inside the celebration</p>
          <h3>Highlight reel</h3>
        </div>
        {playing && highlightEmbedUrl ? (
          <iframe
            src={highlightEmbedUrl}
            title="SenangPlanner highlight reel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="highlight-reel__button"
            onClick={() => highlightEmbedUrl && setPlaying(true)}
            disabled={!highlightEmbedUrl}
          >
            <span className="highlight-reel__play" aria-hidden="true">{highlightEmbedUrl ? "▶" : "＋"}</span>
            <span>{highlightEmbedUrl ? "Play highlight reel" : "Video akan ditambah selepas pautan disahkan"}</span>
          </button>
        )}
      </div>
    </section>
  );
}
