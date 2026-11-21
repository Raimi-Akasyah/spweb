"use client";

import Image from "next/image";
import { gallery } from "@/data/gallery";
import { publicAssetPath } from "@/lib/public-asset";

const groups = [
  { key: "portrait", label: "Potret", items: gallery.filter((item) => item.height > item.width) },
  { key: "landscape", label: "Landskap", items: gallery.filter((item) => item.width > item.height) },
  { key: "square", label: "Petak", items: gallery.filter((item) => item.width === item.height) },
];

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
          {groups.filter((group) => group.items.length > 0).map((group) => (
            <div className="gallery-group" key={group.key}>
              <h2>{group.label}</h2>
              <div className="gl">
                {group.items.map((item) => (
                  <figure className="gi" key={item.image}>
                    <div className="fr" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
                      <Image
                        src={publicAssetPath(item.image)}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
