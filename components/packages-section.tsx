"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { packageAddons, packageFaqs, packages } from "@/data/packages";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ImageLightbox } from "@/components/image-lightbox";

export function PackagesSection() {
  const [activePackage, setActivePackage] = useState(0);

  function openOnHover(index: number) {
    if (window.matchMedia("(hover: hover) and (min-width: 801px)").matches) {
      setActivePackage(index);
    }
  }

  return (
    <>
      <header className="ph">
        <div className="w">
          <div className="pill">Pakej Perkahwinan &amp; Acara · 2026 / 2027</div>
          <h1>Pilih <span className="ser mk">vibe</span> anda.</h1>
          <p className="sub">Lihat kandungan Senang Wedding Package 2027 dan servis yang pasukan kami sediakan untuk hari istimewa anda.</p>
          <div className="acc">
            {packages.map((item, index) => (
              <article
                className={`sl${activePackage === index ? " on" : ""}`}
                key={item.tier}
                onMouseEnter={() => openOnHover(index)}
                onFocus={() => setActivePackage(index)}
              >
                <button
                  type="button"
                  className="vt"
                  onClick={() => setActivePackage(index)}
                  aria-expanded={activePackage === index}
                >
                  {item.name}
                </button>
                <div className="bd">
                  <div>
                    {item.recommended && <span className="fv">FAVE</span>}
                    <span className="vb">{item.vibe}</span>
                    <h2>{item.name}</h2>
                    <p>{item.inclusion}</p>
                    <div className="inc">
                      {item.features.map((feature) => <span key={feature}>{feature}</span>)}
                    </div>
                    <ImageLightbox
                      src="/images/senang-wedding-package-2027.jpg"
                      alt="Flyer Senang Wedding Package 2027"
                      triggerLabel="Tekan untuk besarkan flyer pakej"
                      className="package-flyer-trigger"
                      width={768}
                      height={1024}
                    />
                  </div>
                  <div>
                    <div className="pr"><span>{item.price}</span><small>{item.guestRange}</small></div>
                    <WhatsAppButton
                      className="btn bk sm"
                      variant="dark"
                      message={item.message}
                    >
                      {item.action} <ArrowUpRight className="i" aria-hidden="true" />
                    </WhatsAppButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="note">Harga pakej dikongsi selepas semakan tarikh dan lokasi.</p>
        </div>
      </header>

      <section className="addons">
        <div className="w">
          <h2>Termasuk dalam <span className="ser">pakej.</span></h2>
          <div className="ag">
            {packageAddons.map((addon) => (
              <article className="ac" key={addon.title}>
                <div><span className="tag">{addon.tag}</span><h3>{addon.title}</h3><p>{addon.description}</p></div>
                <b>{addon.price}</b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="w">
          <h2>Soalan yang <span className="ser mk">selalu ditanya.</span></h2>
          <div className="fq">
            {packageFaqs.map((faq) => (
              <article className="fi" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
