import { AboutSection } from "@/components/about-section";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { ClosingSection } from "@/components/closing-section";
import { Footer } from "@/components/footer";
import { GallerySection } from "@/components/gallery-section";
import { Hero } from "@/components/hero";
import { PackagesSection } from "@/components/packages-section";
import { ReviewsSection } from "@/components/reviews-section";
import { SiteHeader } from "@/components/site-header";
import { TeamSection } from "@/components/team-section";
import { VisionSection } from "@/components/vision-section";
import { WaysSection } from "@/components/ways-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <AboutSection />
        <WaysSection />
        <PackagesSection />
        <AvailabilityCalendar />
        <ReviewsSection />
        <VisionSection />
        <TeamSection />
        <GallerySection />
        <ClosingSection />
      </main>
      <Footer />
    </>
  );
}
