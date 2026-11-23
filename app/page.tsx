import { ClosingSection } from "@/components/closing-section";
import { Footer } from "@/components/footer";
import { DateSection, Hero } from "@/components/hero";
import { GalleryPreview } from "@/components/gallery-preview";
import { SiteHeader } from "@/components/site-header";
import { WaysSection } from "@/components/ways-section";
import { WeddingPackagePreview } from "@/components/wedding-package-preview";
import { VisionSection } from "@/components/vision-section";

export default function Home() {
  return (
    <div className="stitch-site stitch-home">
      <SiteHeader />
      <main id="top">
        <Hero />
        <DateSection />
        <WaysSection />
        <WeddingPackagePreview />
        <GalleryPreview />
        <VisionSection />
        <ClosingSection />
      </main>
      <Footer />
    </div>
  );
}
