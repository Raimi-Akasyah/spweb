"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { about } from "@/data/about";

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const number = Number(value.replace(/[^\d.]/g, ""));
  const suffix = value.replace(/[\d.]/g, "");

  useEffect(() => {
    if (!inView || !Number.isFinite(number) || !value.match(/\d/)) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, number, {
      duration: 1.2,
      onUpdate: (current) => setDisplay(`${Math.round(current)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, number, reduceMotion, suffix, value]);

  return <span ref={ref}>{display}</span>;
}

export function AboutSection() {
  return (
    <section className="about section-shell" id="about">
      <div className="section-heading">
        <p className="eyebrow">Tentang SenangPlanner</p>
        <h2>{about.heading}</h2>
      </div>
      <p className="about__intro">{about.paragraph}</p>
      <div className="pillars">
        {about.pillars.map((pillar, index) => (
          <article className="pillar" key={pillar.title}>
            <span className="pillar__number">0{index + 1}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </article>
        ))}
      </div>
      <div className="stats">
        {about.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong><StatValue value={stat.value} /></strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
