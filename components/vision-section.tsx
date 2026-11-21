import { about } from "@/data/about";
import { ImageLightbox } from "@/components/image-lightbox";

export function VisionSection() {
  return (
    <>
      <header className="ph">
        <div className="w">
          <div className="pill">Visi, Misi &amp; Crew · Kenali Kami</div>
          <h1>Kenali <span className="ser mk">vibe</span> &amp; team kami.</h1>
          <p className="sub">{about.intro}</p>
        </div>
      </header>
      <section className="vsec">
        <div className="w">
          <div className="vm">
            <div>
              <span className="ey">Visi · Vibe Check</span>
              <h2>Visi</h2>
              <p>{about.vision}</p>
            </div>
            <div>
              <span className="ey">Misi</span>
              <ul>{about.mission.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          <div className="vision-objectives">
            <div>
              <h2>Objektif</h2>
              <ul>{about.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <ImageLightbox
              src="/images/vision-mission.jpg"
              alt="Infografik visi dan misi Senang Planners"
              triggerLabel="Tekan untuk besarkan infografik"
              className="mission-poster-trigger"
              width={1080}
              height={595}
            />
          </div>
        </div>
      </section>
    </>
  );
}
