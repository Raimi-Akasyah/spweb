import { site } from "@/data/site";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PhotoPlaceholder } from "@/components/photo-placeholder";

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <PhotoPlaceholder
        label="Foto contoh venue · gantikan dengan foto klien"
        aspect="wide"
        src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?fm=jpg&q=70&w=2000&auto=format&fit=crop"
        alt="Contoh foto venue majlis"
        className="footer__photo"
      />
      <div className="footer__shade" aria-hidden="true" />
      <div className="footer__content section-shell">
        <p className="footer__photo-note">Foto contoh · gantikan dengan foto venue sebenar.</p>
        <div className="footer__top">
          <a className="footer__wordmark" href="#home">Senang<br />Planner</a>
          <p className="footer__credit">{site.descriptor}<br />{site.region}</p>
        </div>
        <div className="footer__contact">
          <p className="eyebrow">Let’s make it happen</p>
          <h2>Contact</h2>
          <dl>
            <div><dt>WhatsApp</dt><dd><WhatsAppButton variant="text" message="Hi SenangPlanner, saya ingin berbincang tentang majlis saya.">Mulakan perbualan <span aria-hidden="true">↗</span></WhatsAppButton></dd></div>
            <div><dt>Instagram</dt><dd>{site.instagramUrl ? <a href={site.instagramUrl} target="_blank" rel="noreferrer">@SenangPlanner ↗</a> : <span>Akaun akan ditambah</span>}</dd></div>
            <div><dt>Lokasi</dt><dd>{site.location}</dd></div>
            <div><dt>Waktu</dt><dd>{site.hours}</dd></div>
          </dl>
          <WhatsAppButton
            variant="outline"
            message="Hi SenangPlanner, saya ingin mula merancang acara."
          >
            Start planning with us <span aria-hidden="true">↗</span>
          </WhatsAppButton>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} SenangPlanner. All rights reserved.</p>
          <a href="#home">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
