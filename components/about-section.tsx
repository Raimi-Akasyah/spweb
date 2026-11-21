import { Search, ShieldCheck, Tag } from "lucide-react";
import { about } from "@/data/about";

export function AboutSection() {
  return (
    <section id="tentang">
      <div className="w">
        <h2 className="rv">Detail yang <span className="ser mk">kau tak perlu</span> peningkan.</h2>
        <div className="bento">
          <article className="bc bA rv">
            <div className="im p-veil" role="img" aria-label="Pasangan pengantin di bawah veil" />
            <div className="tx">
              <p className="big">Majlis anda, <span className="ser">zero drama.</span></p>
              <p>Kami urus semua benda remeh—dari kejar vendor, jaga bajet, sampai susun atur dewan—supaya kau boleh betul-betul hadir dan enjoy setiap momen tanpa buka Excel.</p>
            </div>
          </article>
          <article className="bc bB rv">
            <div className="ico"><Search aria-hidden="true" /></div>
            <div><h3>Detail Obsessed</h3><p style={{ maxWidth: "34ch" }}>Dari susun atur meja sampai lagu masuk dewan, semua kita semak sama-sama.</p></div>
          </article>
          <article className="bc bC rv">
            <div className="ico"><ShieldCheck aria-hidden="true" /></div>
            <div><h3>Backup Plan Ready</h3><p>Hujan tiba-tiba atau vendor lambat? Team kami dah standby Plan B tanpa kau perasan.</p></div>
          </article>
          <article className="bc bD rv">
            <div className="ico"><Tag aria-hidden="true" /></div>
            <div><h3>Harga Jujur</h3><p>Skop kerja dan kos dibentang awal-awal. Tiada caj tersembunyi lepas sign.</p></div>
          </article>
        </div>
        <div className="stats rv">
          {about.stats.map((stat) => (
            <div key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
