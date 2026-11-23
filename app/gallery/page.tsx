import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { GallerySection } from "@/components/gallery-section";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Portfolio Acara · Senang Planners",
  description: "Lihat acara yang pernah dikendalikan oleh Senang Planners.",
};

export default function GalleryPage() {
  return (
    <div className="stitch-site stitch-subpage">
      <SiteHeader />
      <main id="top">
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
