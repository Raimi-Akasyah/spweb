"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";
import { packages } from "@/data/packages";

export function WeddingPackagePreview() {
  const { language } = useLanguage();
  const bm = language === "bm";
  const weddingPackage = packages[0];

  return (
    <section className="wedding-preview" id="pakej">
      <div className="w">
        <div className="wedding-preview__card">
          <div className="wedding-preview__copy">
            <div className="wedding-preview__intro">
              <p className="ey">{bm ? "Pakej Khas Perkahwinan" : "Dedicated Wedding Package"}</p>
              <h2>Senang <span className="ser">Wedding Package</span></h2>
              <p>{bm
                ? "Untuk majlis nikah dan sanding pada hari yang sama, sehingga 8 jam."
                : "For your akad nikah and wedding reception on the same day, for up to 8 hours."}</p>
            </div>
            <div className="wedding-preview__included">
              <h3>{bm ? "Termasuk dalam pakej" : "Included in the package"}</h3>
              <ul>
                {(bm ? weddingPackage.features : weddingPackage.featuresEn).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="wedding-preview__bonus">
              <span>{bm ? "Bonus istimewa" : "A little extra"}</span>
              <p>
                <strong>{bm ? "Percuma:" : "Complimentary:"}</strong> {bm ? weddingPackage.bonus : weddingPackage.bonusEn}
                <span aria-hidden="true"> · </span>
                {bm ? weddingPackage.promotion : weddingPackage.promotionEn}
              </p>
            </div>
          </div>
          <aside className="wedding-preview__actions">
            <p>{bm ? "Rancang majlis anda dengan lebih senang" : "Make planning your day easier"}</p>
            <span>{bm ? weddingPackage.price : weddingPackage.priceEn}</span>
            <WhatsAppButton
              className="btn bk"
              variant="dark"
              message={bm ? weddingPackage.message : weddingPackage.messageEn}
            >
              {bm ? weddingPackage.action : weddingPackage.actionEn} <ArrowUpRight className="i" aria-hidden="true" />
            </WhatsAppButton>
            <Link href="/packages">
              {bm ? "Lihat butiran pakej" : "View package details"} <ArrowUpRight className="i" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
