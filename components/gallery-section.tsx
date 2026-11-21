"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { gallery } from "@/data/gallery";

const filters = [
  { key: "all", label: `Semua (${gallery.length})` },
  { key: "pakej", label: "Pakej" },
  { key: "pasukan", label: "Pasukan & Visi" },
];
const layouts = ["ga", "gb", "gc", "gd"];

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const items = useMemo(
    () => gallery.filter((item) => activeFilter === "all" || item.category === activeFilter),
    [activeFilter],
  );

  return (
    <>
      <header className="ph">
        <div className="w">
          <div className="pill">Senang Planners · Galeri</div>
          <h1>Kenali <span className="ser mk">kami.</span></h1>
          <p className="sub">Lihat pakej, pasukan dan hala tuju Senang Planners.</p>
          <div className="gf" role="group" aria-label="Tapis kategori galeri">
            {filters.map((filter) => (
              <button
                type="button"
                className={activeFilter === filter.key ? "on" : ""}
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                aria-pressed={activeFilter === filter.key}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <section style={{ paddingTop: 16 }}>
        <div className="w">
          <div className="gl">
            {items.map((item) => {
              const originalIndex = gallery.indexOf(item);
              return (
                <figure className={`gi ${layouts[originalIndex]}`} key={item.title}>
                  <div className="fr">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={1080}
                      height={1080}
                      sizes="(max-width: 700px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption>
                    {item.title}
                    <small>{item.caption}</small>
                    {item.reelUrl && (
                      <a href={item.reelUrl} target="_blank" rel="noopener noreferrer">
                        Lihat profil
                      </a>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
