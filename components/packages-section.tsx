import { packages } from "@/data/packages";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function PackagesSection() {
  return (
    <section className="packages section-shell" id="packages">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Pilihan yang sesuai untuk anda</p>
          <h2>Packages</h2>
        </div>
        <p>Setiap majlis berbeza. Kami akan cadangkan skop dan harga berdasarkan keperluan anda.</p>
      </div>
      <div className="package-list">
        {packages.map((item) => (
          <article className={`package-row${item.recommended ? " package-row--recommended" : ""}`} key={item.tier}>
            <span className="package-row__tier">{item.tier}</span>
            <h3>{item.name}</h3>
            <p className="package-row__price">{item.price}</p>
            <p className="package-row__inclusion">{item.inclusion}</p>
            <WhatsAppButton variant={item.recommended ? "gold" : "outline"} message={item.message}>
              Explore <span aria-hidden="true">↗</span>
            </WhatsAppButton>
          </article>
        ))}
      </div>
      <p className="content-note">Harga contoh belum dimasukkan — kemas kini data pakej sebelum diterbitkan.</p>
    </section>
  );
}
