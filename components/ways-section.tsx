import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { WhatsAppButton } from "@/components/whatsapp-button";

const pageCards = [
  {
    className: "h1",
    label: "01 · Harga & Skop",
    title: "Pakej & Vibe",
    description: "Lihat Senang Wedding Package 2027, skop servis dan apa yang disertakan dalam pakej.",
    link: "/packages",
    action: "Lihat Pakej",
  },
  {
    className: "h2",
    label: "02 · Visi, Misi & Crew",
    title: "Vibe Check & Pasukan",
    description: "Kenali visi, misi dan lima peranan pasukan yang memastikan majlis anda berjalan lancar.",
    link: "/vibe-check",
    action: "Kenali Team",
  },
  {
    className: "h3",
    label: "03 · Pakej & Pasukan",
    title: "Galeri Senang Planners",
    description: "Lihat imej pakej, pasukan dan hala tuju Senang Planners.",
    link: "/gallery",
    action: "Buka Galeri",
  },
];

export function WaysSection() {
  return (
    <>
      <section className="svc" id="servis">
        <div className="w">
          <h2 className="rv">Macam mana kita <span className="ser">work together.</span></h2>
          <div className="stk">
            {services.map((service, index) => (
              <article
                className={`sc c${index}`}
                style={{ top: `calc(104px + ${index * 22}px)` }}
                key={service.number}
              >
                <span className="tab">{service.number} · {["Planning", "On-Day Crew", "Digital"][index]}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <WhatsAppButton
                    className="btn bk"
                    variant="dark"
                    message={service.message}
                  >
                    Tanya pasal ni <ArrowUpRight className="i" aria-hidden="true" />
                  </WhatsAppButton>
                </div>
                <div className="fr sa">
                  <div className={`im ${service.image}`} role="img" aria-label={`Contoh ${service.title}`} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="w">
          <h2 className="rv">Teroka <span className="ser mk">lebih lanjut.</span></h2>
          <div className="hub">
            {pageCards.map((card) => (
              <article className={`hc ${card.className}`} key={card.link}>
                <div>
                  <span className="ey">{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <Link className="btn bk sm" href={card.link}>
                  {card.action} <ArrowUpRight className="i" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
