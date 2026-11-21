"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";

const links = [
  ["Home", "#home"],
  ["About Us", "#about"],
  ["Our Services", "#services"],
  ["Our Clients", "#reviews"],
  ["Media Gallery", "#gallery"],
  ["Contact Us", "#contact"],
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <Link className="announcement" href="/booking">
        <span>Tarikh majlis anda masih tersedia?</span>
        <span className="announcement__link">Semak availability <span aria-hidden="true">↴</span></span>
      </Link>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="SenangPlanner — Home">
          Senang<span>Planner</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <Link className="header-book" href="/booking">
          Pick your date <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <div className="fixed-tabs" aria-label="Quick navigation">
        <button type="button" onClick={() => setMenuOpen(true)}>MENU <span aria-hidden="true">↴</span></button>
        <a href="#packages">PACKAGES <span aria-hidden="true">↴</span></a>
        <Link className="button button--dark" href="/booking">
          BOOK EVENT <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {menuOpen && (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Main menu">
          <button
            type="button"
            className="menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            Close <span aria-hidden="true">×</span>
          </button>
          <p className="eyebrow">SenangPlanner · Seluruh Malaysia</p>
          <nav className="menu-links">
            {links.map(([label, href], index) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>{label}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <p className="menu-caption">{site.descriptor}</p>
        </div>
      )}
    </>
  );
}
