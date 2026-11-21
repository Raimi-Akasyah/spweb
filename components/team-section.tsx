import { team, teamProfiles } from "@/data/team";
import { about } from "@/data/about";
import { ImageLightbox } from "@/components/image-lightbox";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function TeamSection() {
  return (
    <section className="team-section">
      <div className="w">
        <h2>Siapa dalam <span className="ser mk">pasukan kami?</span></h2>
        <p className="team-intro">Event Coordinator, Event Planner, Emcee dan PA System — satu pasukan untuk merancang serta mengurus majlis anda.</p>
        <div className="tm">
          {team.map((member, index) => (
            <article className="mb" key={member.role}>
              <span className="team-role-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="role-content">
                <h3>{member.role}</h3>
                <p className="bio">{member.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="team-profiles" aria-label="Profil emcee dari Linktree Senang Planners">
          {teamProfiles.map((profile) => (
            <a className="team-profile" href={profile.url} key={profile.name} target="_blank" rel="noopener noreferrer">
              <div>
                <h3>{profile.name}</h3>
                <span>TikTok {profile.handle}</span>
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <div className="team-after">
          <div className="team-benefits">
            <span className="ey">Apa yang anda dapat?</span>
            <ul>{about.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
            <WhatsAppButton
              className="btn bk sm"
              message="Hi SenangPlanner, saya ingin bertanya tentang servis pasukan untuk majlis saya."
            >
              Hubungi pasukan kami
            </WhatsAppButton>
          </div>
          <ImageLightbox
            src="/images/team-and-benefits.jpg"
            alt="Infografik pasukan dan servis Senang Planners"
            triggerLabel="Tekan untuk besarkan info pasukan"
            className="team-poster-trigger"
            width={768}
            height={1087}
          />
        </div>
      </div>
    </section>
  );
}
