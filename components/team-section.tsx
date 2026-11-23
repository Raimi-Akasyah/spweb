"use client";

import { team, teamProfiles } from "@/data/team";
import { about } from "@/data/about";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";

export function TeamSection() {
  const { language } = useLanguage();
  const bm = language === "bm";
  const benefits = bm ? about.benefits : about.benefitsEn;

  return (
    <section className="team-section">
      <div className="w">
        <h2>{bm ? "Pasukan " : "Our "}<span className="ser mk">{bm ? "Acara Kami" : "Event Team"}</span></h2>
        <p className="team-intro">{bm
          ? "Event Planner, Event Coordinator, Floor Manager, pengacara dan kru menyelaras acara anda dari persediaan hingga acara tamat."
          : "Our event planners, coordinators, floor managers, emcees and crew coordinate your event from preparation through to completion."}</p>
        <div className="tm">
          {team.map((member, index) => (
            <article className="mb" key={member.role}>
              <span className="team-role-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="role-content">
                <h3>{bm ? member.role : member.roleEn}</h3>
                <p className="bio">{bm ? member.description : member.descriptionEn}</p>
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
            <span className="ey">{bm ? "Bagaimana Kami Membantu" : "How We Help"}</span>
            <ul>{benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
            <WhatsAppButton
              className="btn bk sm"
              message={bm
                ? "Hi Senang Planners! Saya ingin bertanya tentang pasukan acara."
                : "Hi Senang Planners! I would like to ask about your event team."}
            >
              {bm ? "Hubungi Pasukan Kami" : "Contact Our Team"}
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
