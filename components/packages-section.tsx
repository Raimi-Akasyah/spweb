"use client";

import { ArrowUpRight } from "lucide-react";
import { packages } from "@/data/packages";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";

export function PackagesSection() {
  const { language } = useLanguage();
  const bm = language === "bm";

  return (
    <>
      <header className="ph package-page" id="pakej">
        <div className="w">
          <div className="pill">{bm ? "Pakej Perkahwinan" : "Wedding Package"}</div>
          <h1>Senang <span className="ser mk">Wedding Package.</span></h1>
          <p className="sub">{bm
            ? "Untuk nikah dan sanding pada hari yang sama, sehingga 8 jam. Semua harga pakej dan pilihan servis diberi melalui WhatsApp."
            : "For akad nikah and reception on the same day, for up to 8 hours. All package and service prices are provided through WhatsApp."}</p>
          <div className="package-card">
            {packages.map((item) => (
              <article key={item.tier}>
                <div className="package-card__intro">
                  <span className="ey">{bm ? "Edisi Khas 2027" : "Special 2027 Edition"}</span>
                  <h2>{bm ? item.name : item.nameEn}</h2>
                  <p>{bm ? item.inclusion : item.inclusionEn}</p>
                  <strong>{bm ? item.guestRange : item.guestRangeEn}</strong>
                </div>
                <div className="package-card__lists">
                  <section className="package-card__group">
                    <h3>{bm ? "Semua dalam satu pakej" : "All-inclusive"}</h3>
                    <ul>
                      {(bm ? item.features : item.featuresEn).map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </section>
                  <section className="package-card__group">
                    <h3>{bm ? "Juga termasuk" : "Also included"}</h3>
                    <ul>
                      {(bm ? item.benefits : item.benefitsEn).map((benefit) => <li key={benefit}>{benefit}</li>)}
                    </ul>
                  </section>
                </div>
                <div className="package-card__extras">
                  <p className="package-card__bonus">
                    <span>{bm ? "Percuma" : "Complimentary"}</span>
                    <strong>{bm ? item.bonus : item.bonusEn}</strong>
                  </p>
                  <p className="package-card__promotion">{bm ? item.promotion : item.promotionEn}</p>
                </div>
                <div className="package-card__stats">
                  {item.socialProof.map((stat) => (
                    <div className="package-card__stat" key={stat.value}>
                      <strong>{stat.value}</strong>
                      <span>{bm ? stat.label : stat.labelEn}</span>
                    </div>
                  ))}
                </div>
                <div className="package-card__footer">
                  <div className="pr">
                    <span>{bm ? item.price : item.priceEn}</span>
                  </div>
                  <WhatsAppButton
                    className="btn bk sm"
                    variant="dark"
                    message={bm ? item.message : item.messageEn}
                  >
                    {bm ? item.action : item.actionEn} <ArrowUpRight className="i" aria-hidden="true" />
                  </WhatsAppButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
