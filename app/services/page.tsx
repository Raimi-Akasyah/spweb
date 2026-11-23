import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { WaysSection } from "@/components/ways-section";

export const metadata: Metadata = {
  title: "Servis Kami · Senang Planners",
  description: "Pengurusan dan koordinasi acara, pengacara, floor manager, kru, PA system dan sewaan intercom.",
};

export default function ServicesPage() {
  return (
    <div className="stitch-site stitch-subpage">
      <SiteHeader />
      <main id="top">
        <WaysSection />
      </main>
      <Footer />
    </div>
  );
}
