import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { GallerySection } from "@/components/gallery-section";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Media Gallery · SenangPlanner",
  description: "Detik majlis, pelamin, dan behind-the-scenes SenangPlanner.",
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
