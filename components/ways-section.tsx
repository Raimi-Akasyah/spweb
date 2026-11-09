import { services } from "@/data/services";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function WaysSection() {
  return (
    <section className="ways" id="services">
      <div className="ways__backdrop" aria-hidden="true" />
      <div className="ways__inner section-shell">
        <div className="ways__heading">
          <p className="eyebrow">SenangPlanner · What we do</p>
          <h2>Ways We Can <em>Work Together</em></h2>
        </div>
        <div className="ways__stack">
          {services.map((service, index) => (
            <article
              className={`service-panel service-panel--${index + 1}`}
              key={service.number}
              style={{ top: `calc(18px + ${index * 18}px)` }}
            >
              <span className="service-panel__tab">
                {index === 0 ? "PACKAGES" : index === 1 ? "AVAILABILITY" : "CONTACT"}
              </span>
              <div className="service-panel__copy">
                <span className="service-panel__number">{service.number} / 03</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <WhatsAppButton variant="text" message={service.message}>
                  More Details <span aria-hidden="true">↗</span>
                </WhatsAppButton>
              </div>
              <PhotoPlaceholder
                label={`Contoh foto perkhidmatan: ${service.title}`}
                aspect="square"
                src={service.image}
                alt={`Contoh foto ${service.title}`}
                className="service-panel__photo"
              />
            </article>
          ))}
        </div>
        <p className="ways__note">Skop perkhidmatan disesuaikan selepas sesi konsultasi.</p>
      </div>
    </section>
  );
}
