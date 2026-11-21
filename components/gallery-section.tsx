"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gallery } from "@/data/gallery";

const filters = [
  { key: "all", label: `Semua (${gallery.length})` },
  { key: "nikah", label: "Nikah & Pelamin" },
  { key: "resepsi", label: "Resepsi & Potret" },
  { key: "bts", label: "BTS & Detail" },
];
const layouts = ["ga", "gb", "gc", "gd", "ge", "gf2", "gf2"];

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
          <div className="pill">Real Weddings &amp; BTS · 35mm Film Look</div>
          <h1>Media <span className="ser mk">Gallery.</span></h1>
          <p className="sub">Detik sebenar daripada majlis pasangan kami—dari setup pagi, nikah yang tenang, sampai last song atas dance floor.</p>
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
                    <div className={`im ${item.image}`} role="img" aria-label={item.title} />
                  </div>
                  <figcaption>{item.title}<small>{item.caption}</small></figcaption>
                </figure>
              );
            })}
          </div>
          <div className="reel">
            <h2>Highlight <span className="ser mk">reel</span></h2>
            <a className="rv2" href="#hubungi">
              <span className="pl"><ArrowRight className="i" aria-hidden="true" /></span>
              <span>
                <div>Tonton BTS &amp; Highlight Reel (0:45)</div>
                <small>@senangplanner.my di Instagram &amp; TikTok</small>
              </span>
              <ArrowUpRight className="i" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
