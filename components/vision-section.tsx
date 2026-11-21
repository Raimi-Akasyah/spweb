import { about } from "@/data/about";
import { vision } from "@/data/vision";

export function VisionSection() {
  return (
    <>
      <header className="ph">
        <div className="w">
          <div className="pill">Visi, Misi &amp; Crew · Kenali Kami</div>
          <h1>Kenali <span className="ser mk">vibe</span> &amp; team kami.</h1>
          <p className="sub">Kami bukan agensi kaku yang bercakap ikut skrip. Ini prinsip kerja kami dan orang-orang yang akan jaga majlis kau dari pagi sampai malam.</p>
        </div>
      </header>
      <section className="vsec">
        <div className="w">
          <div className="vm">
            <div>
              <span className="ey">Visi · Vibe Check</span>
              <h2>Enjoy hari sendiri.</h2>
              <p>{vision.vision}</p>
            </div>
            <div>
              <span className="ey">Misi · Janji Kami</span>
              <h2>Jujur &amp; pantas.</h2>
              <p>{vision.mission}</p>
            </div>
          </div>
          <div className="stats">
            {about.stats.map((stat) => (
              <div key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
