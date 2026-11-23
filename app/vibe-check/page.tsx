import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TeamSection } from "@/components/team-section";
import { VisionSection } from "@/components/vision-section";

export const metadata: Metadata = {
  title: "Tentang Kami · Senang Planners",
  description: "Kenali visi, misi dan pasukan Senang Planners.",
};

export default function VibeCheckPage() {
  return (
    <div className="stitch-site stitch-subpage">
      <SiteHeader />
      <main id="top">
        <VisionSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
