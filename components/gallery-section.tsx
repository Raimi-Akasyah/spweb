"use client";

import Image from "next/image";
import { gallery } from "@/data/gallery";
import { publicAssetPath } from "@/lib/public-asset";

const layouts = ["ga", "gb", "gc", "gd"];

export function GallerySection() {
  return (
    <>
      <header className="ph">
        <div className="w">
          <div className="pill">Senang Planners · Galeri acara</div>
          <h1>Momen <span className="ser mk">majlis.</span></h1>
          <p className="sub">Foto sebenar daripada majlis yang pernah diuruskan Senang Planners.</p>
        </div>
      </header>
      <section style={{ paddingTop: 16 }}>
        <div className="w">
          <div className="gl">
            {gallery.map((item) => {
              const originalIndex = gallery.indexOf(item);
              return (
                <figure className={`gi ${layouts[originalIndex % layouts.length]}`} key={item.title}>
                  <div className="fr">
                    <Image
                      src={publicAssetPath(item.image)}
                      alt={item.alt}
                      width={1080}
                      height={1080}
                      sizes="(max-width: 700px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption>
                    {item.title}
                    <small>{item.caption}</small>
                    {item.linkUrl && (
                      <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                        {item.linkLabel}
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
