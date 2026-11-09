import { team } from "@/data/team";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function TeamSection() {
  return (
    <section className="team section-shell" id="team">
      <div className="team__heading">
        <p className="eyebrow">Meet the team</p>
        <h2>Wajah di sebalik majlis anda.</h2>
      </div>
      <div className="team-grid">
        {team.map((member, index) => (
          <article className="team-member" key={`${member.name}-${index}`}>
            <PhotoPlaceholder
              label={`Foto contoh ahli pasukan ${index + 1} · gantikan dengan foto sebenar`}
              aspect="portrait"
              src={member.image}
              alt={`Foto contoh ${member.role}; gantikan dengan foto ahli pasukan sebenar`}
              className="team-member__photo"
            />
            <div className="team-member__panel">
              <div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <WhatsAppButton
                className="team-member__contact"
                variant="gold"
                message={member.message}
                aria-label={`WhatsApp ${member.name}`}
              >
                ↗
              </WhatsAppButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
