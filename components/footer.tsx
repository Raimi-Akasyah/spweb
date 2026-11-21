import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
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
            <b><WhatsAppButton variant="text" message="Hi SenangPlanner, saya ingin berbincang tentang majlis saya.">Chat dengan kami</WhatsAppButton></b>
          </div>
          <div>IG &amp; TikTok<b>@senangplanner.my</b></div>
          <div>Lokasi<b>{site.location}</b></div>
          <div>Waktu<b>{site.hours}</b></div>
        </div>
        <div className="acts" style={{ justifyContent: "center", marginTop: 44 }}>
          <Link className="btn gd" href="/booking">
            Start planning with us <ArrowUpRight className="i" aria-hidden="true" />
          </Link>
        </div>
        <div className="wm" aria-hidden="true">
          <Image src="/images/senangplanner-logo.png" alt="" width={372} height={219} unoptimized />
        </div>
        <div className="cp">
          {site.descriptor} · {site.region} · © {new Date().getFullYear()} SenangPlanner. All rights reserved.{" "}
          <Link href="/#top" style={{ textDecoration: "underline" }}>Back to top</Link>
        </div>
      </div>
    </footer>
  );
}
