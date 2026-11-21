import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ClosingSection() {
  return (
    <section className="cta">
      <div className="w">
        <div className="cg2">
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
