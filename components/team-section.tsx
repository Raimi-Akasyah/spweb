import { ArrowUpRight } from "lucide-react";
import { team } from "@/data/team";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function TeamSection() {
  return (
    <section>
      <div className="w">
        <h2>Wajah di sebalik <span className="ser mk">majlis anda.</span></h2>
        <div className="tm">
          {team.map((member) => (
            <article className="mb" key={member.name}>
              <div className="av"><span>{member.initials}</span></div>
              <div className="in">
                <div><h3>{member.name}</h3><small>{member.role}</small></div>
                <WhatsAppButton
                  className="wa"
                  variant="gold"
                  message={member.message}
                  aria-label={`Chat dengan ${member.name}`}
                >
                  <ArrowUpRight className="i" aria-hidden="true" />
                </WhatsAppButton>
              </div>
              <p className="bio">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
