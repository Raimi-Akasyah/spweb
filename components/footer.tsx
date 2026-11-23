"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { publicAssetPath } from "@/lib/public-asset";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { language } = useLanguage();
  const bm = language === "bm";

  return (
    <footer className="ftr">
      <div className="w">
        <h2 style={{ margin: "0 auto 56px", maxWidth: "none" }}>
          {bm ? "Mari wujudkan " : "Let’s make "}<span className="ser mk">{bm ? "acara anda." : "it happen."}</span>
        </h2>
        <div className="ct">
          <div>WhatsApp
            <b><WhatsAppButton variant="text" message={bm
              ? "Hi Senang Planners! Saya ingin berbincang tentang acara saya."
              : "Hi Senang Planners! I would like to discuss my event."}>{site.whatsappDisplay} · {bm ? "Chat" : "Message"}</WhatsAppButton></b>
          </div>
          <div>Instagram
            <b><a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">@senangplanners.my</a></b>
          </div>
          <div>TikTok
            <b><a href={site.tiktokUrl} target="_blank" rel="noopener noreferrer">@senangplanners.my</a></b>
          </div>
          <div>{bm ? "Pautan lanjut" : "More links"}
            <b><a href={site.linktreeUrl} target="_blank" rel="noopener noreferrer">Senangplanners.my · Linktree</a></b>
          </div>
        </div>
        <div className="acts" style={{ justifyContent: "center", marginTop: 44 }}>
          <Link className="btn gd" href="/contact">
            {bm ? "Bincang Acara Anda" : "Discuss Your Event"} <ArrowUpRight className="i" aria-hidden="true" />
          </Link>
        </div>
        <div className="wm" aria-hidden="true">
          <Image src={publicAssetPath("/images/senangplanner-logo.png")} alt="" width={372} height={219} unoptimized />
        </div>
        <div className="cp">
          {bm ? site.descriptorMs : site.descriptorEn} · {site.region} · © {new Date().getFullYear()} SenangPlanner. {bm ? "Hak cipta terpelihara." : "All rights reserved."}{" "}
          <Link href="/#top" style={{ textDecoration: "underline" }}>{bm ? "Kembali ke atas" : "Back to top"}</Link>
        </div>
      </div>
    </footer>
  );
}
