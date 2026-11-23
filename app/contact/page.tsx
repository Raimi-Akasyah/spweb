import type { Metadata } from "next";
import { ClosingSection } from "@/components/closing-section";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Hubungi Kami · Senang Planners",
  description: "Bincangkan acara anda bersama Senang Planners melalui WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="stitch-site stitch-subpage">
      <SiteHeader />
      <main id="top">
        <ClosingSection />
      </main>
      <Footer />
    </div>
  );
}
