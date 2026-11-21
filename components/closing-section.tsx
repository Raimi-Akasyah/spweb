import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ClosingSection() {
  return (
    <section className="cta">
      <div className="w">
        <div className="cg2">
          <div className="cl" aria-label="Kolaj contoh majlis">
            <div className="fr"><div className="im p-warm" role="img" aria-label="Pasangan pengantin di bawah veil" /></div>
            <div className="fr"><div className="im p-beach" role="img" aria-label="Majlis di tepi pantai" /></div>
            <div className="fr"><div className="im p-sea" role="img" aria-label="Pasangan berjalan di tepi laut" /></div>
          </div>
          <div>
            <h2 className="rv">Kami wujudkan majlis <span className="ser">impian anda.</span></h2>
            <p>Ceritakan tarikh dan idea kasar kat kami. Kami balas di WhatsApp dengan cadangan vibe &amp; anggaran kos—tiada paksaan.</p>
            <Link className="btn bk" href="/booking">
              Lock Tarikh Sekarang <ArrowUpRight className="i" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
