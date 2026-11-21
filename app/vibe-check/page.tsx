import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TeamSection } from "@/components/team-section";
import { VisionSection } from "@/components/vision-section";

export const metadata: Metadata = {
  title: "Vibe Check & Pasukan · SenangPlanner",
  description: "Kenali visi, misi dan pasukan SenangPlanner.",
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
