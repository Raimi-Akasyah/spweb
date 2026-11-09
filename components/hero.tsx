import { site } from "@/data/site";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__brand">
        <h1 className="hero__wordmark">Senang<br />Planner</h1>
        <p className="hero__credit">
          {site.descriptor}
          <br />
          {site.region}
        </p>
      </div>
      <div className="hero__side-note"><i /><span>Our Signature</span><i /></div>
      <div className="hero__main-photo">
        <PhotoPlaceholder
          label="Contoh foto: pasangan dan venue · gantikan dengan foto klien"
          aspect="wide"
          src="https://images.unsplash.com/photo-1606216836549-f60d04e4a20b?fm=jpg&q=70&w=1800&auto=format&fit=crop"
          alt="Contoh foto majlis perkahwinan di venue"
          priority
        />
      </div>
      <div className="hero__portrait hero__portrait--large">
        <PhotoPlaceholder
          label="Contoh foto pasangan"
          aspect="portrait"
          src="https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?fm=jpg&q=70&w=900&auto=format&fit=crop"
          alt="Contoh potret pasangan"
          priority
        />
      </div>
      <div className="hero__portrait hero__portrait--small">
        <PhotoPlaceholder
          label="Contoh perincian majlis"
          aspect="portrait"
          src="https://images.unsplash.com/photo-1519741196428-6a2175fa2557?fm=jpg&q=70&w=700&auto=format&fit=crop"
          alt="Contoh perincian majlis"
        />
      </div>
      <div className="hero__copy">
        <h1>Kami uruskan stress, <br />anda nikmati majlis.</h1>
        <div className="hero__rule" />
        <p className="hero__quote">“We handle the stress, you handle the joy.”</p>
        <div className="hero__rule" />
        <div className="hero__actions">
          <WhatsAppButton
            variant="text"
            message="Hi SenangPlanner, saya ingin mendapatkan konsultasi percuma tentang majlis saya."
          >
            WhatsApp kami
          </WhatsAppButton>
          <p className="hero__consultation">free consultation<br />balas dalam sehari</p>
        </div>
      </div>
      <div className="hero__tagline">
        <span>Plan The</span>
        <em>Senang</em>
        <span>Good venues<br />Good vendors<br />Good vibes</span>
      </div>
    </section>
  );
}
