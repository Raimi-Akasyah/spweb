import { vision } from "@/data/vision";

export function VisionSection() {
  return (
    <section className="vision">
      <div className="vision__inner section-shell">
        <p className="eyebrow">Apa yang kami percaya</p>
        <div className="vision__columns">
          <article>
            <span>01 / Visi</span>
            <h2>Visi</h2>
            <p>{vision.vision}</p>
          </article>
          <article>
            <span>02 / Misi</span>
            <h2>Misi</h2>
            <p>{vision.mission}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
