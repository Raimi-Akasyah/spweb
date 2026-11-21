import { about } from "@/data/about";
import { ImageLightbox } from "@/components/image-lightbox";

export function AboutSection() {
  return (
    <section id="tentang">
      <div className="w">
        <div className="about-heading">
          <div className="pill">Kenali Senang Planners</div>
          <h2>Kami datang, <span className="ser mk">anda senang.</span></h2>
          <p>{about.intro}</p>
        </div>
        <div className="about-values">
          <article className="about-value">
            <span className="ey">Visi</span>
            <h3>Satu pusat untuk majlis anda.</h3>
            <p>{about.vision}</p>
          </article>
          <article className="about-value about-value--mission">
            <span className="ey">Misi</span>
            <ul>{about.mission.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        <div className="about-objectives">
          <div>
            <h3>Matlamat kami</h3>
            <ul>{about.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <ImageLightbox
            src="/images/vision-mission.jpg"
            alt="Infografik visi dan misi Senang Planners"
            triggerLabel="Tekan untuk besarkan visi dan misi"
            className="mission-poster-trigger"
            width={1080}
            height={595}
          />
        </div>
      </div>
    </section>
  );
}
