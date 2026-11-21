import { AboutSection } from "@/components/about-section";
import { ClosingSection } from "@/components/closing-section";
import { Footer } from "@/components/footer";
import { DateSection, Hero } from "@/components/hero";
import { ReviewsSection } from "@/components/reviews-section";
import { SiteHeader } from "@/components/site-header";
import { WaysSection } from "@/components/ways-section";

export default function Home() {
  return (
    <div className="stitch-site stitch-home">
      <SiteHeader />
      <main id="top">
        <Hero />
        <div className="mq" aria-hidden="true">
          <div><span>Less stress, more dance floor</span><span className="o">Your day, your rules</span><span>Less stress, more dance floor</span><span className="o">Your day, your rules</span><span>Less stress, more dance floor</span><span className="o">Your day, your rules</span><span>Less stress, more dance floor</span><span className="o">Your day, your rules</span></div>
        </div>
        <div className="mq" aria-hidden="true">
          <div><span>Plan the Senang</span><span className="o">Good venues</span><span>Good vendors</span><span className="o">Good vibes</span><span>Plan the Senang</span><span className="o">Good venues</span><span>Good vendors</span><span className="o">Good vibes</span></div>
        </div>
        <DateSection />
        <AboutSection />
        <WaysSection />
        <ReviewsSection />
        <ClosingSection />
      </main>
      <Footer />
    </div>
  );
}
