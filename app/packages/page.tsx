import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { PackagesSection } from "@/components/packages-section";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Pakej & Vibe · SenangPlanner",
  description: "Teroka pakej majlis, add-on dan jawapan kepada soalan lazim.",
};

export default function PackagesPage() {
  return (
    <div className="stitch-site stitch-subpage">
      <SiteHeader />
      <main id="top">
        <PackagesSection />
      </main>
      <Footer />
    </div>
  );
}
