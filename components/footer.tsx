import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { publicAssetPath } from "@/lib/public-asset";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function Footer() {
  return (
    <footer className="ftr" id="hubungi">
      <div className="w">
        <h2 style={{ margin: "0 auto 56px", maxWidth: "none" }}>
          Let’s make it <span className="ser mk">happen.</span>
        </h2>
        <div className="ct">
          <div>WhatsApp
            <b><WhatsAppButton variant="text" message="Hi SenangPlanner, saya ingin berbincang tentang majlis saya.">{site.whatsappDisplay} · Chat</WhatsAppButton></b>
          </div>
          <div>Instagram
            <b><a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">@senangplanners.my</a></b>
          </div>
          <div>TikTok
            <b><a href={site.tiktokUrl} target="_blank" rel="noopener noreferrer">@senangplanners.my</a></b>
          </div>
          <div>Tempah tarikh
            <b><a href={site.bookingWhatsappUrl} target="_blank" rel="noopener noreferrer">BOOK YOUR DATE!</a></b>
          </div>
          <div>Semua pautan
            <b><a href={site.linktreeUrl} target="_blank" rel="noopener noreferrer">Senangplanners.my · Linktree</a></b>
          </div>
        </div>
        <div className="acts" style={{ justifyContent: "center", marginTop: 44 }}>
          <Link className="btn gd" href="/booking">
            Start planning with us <ArrowUpRight className="i" aria-hidden="true" />
          </Link>
        </div>
        <div className="wm" aria-hidden="true">
          <Image src={publicAssetPath("/images/senangplanner-logo.png")} alt="" width={372} height={219} unoptimized />
        </div>
        <div className="cp">
          {site.descriptor} · {site.region} · © {new Date().getFullYear()} SenangPlanner. All rights reserved.{" "}
          <Link href="/#top" style={{ textDecoration: "underline" }}>Back to top</Link>
        </div>
      </div>
    </footer>
  );
}
