"use client";

import { about } from "@/data/about";
import { useLanguage } from "@/components/language-provider";

export function VisionSection() {
  const { language } = useLanguage();
  const bm = language === "bm";
  const mission = bm ? about.mission : about.missionEn;
  const objectives = bm ? about.objectives : about.objectivesEn;

  return (
    <section className="vsec" id="tentang">
      <div className="w">
        <p className="ey about-eyebrow">{bm ? "Tentang Kami · Visi & Misi" : "About Us · Vision & Mission"}</p>
        <div className="vm">
          <div>
            <h2>{bm ? "Visi" : "Vision"}</h2>
            <p>{bm ? about.vision : about.visionEn}</p>
          </div>
          <div>
            <h2>{bm ? "Misi" : "Mission"}</h2>
            <ul>{mission.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="vision-objectives">
          <div>
            <h2>{bm ? "Objektif" : "Objectives"}</h2>
            <ul>{objectives.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
