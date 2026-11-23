"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { publicAssetPath } from "@/lib/public-asset";
import { useLanguage } from "@/components/language-provider";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const menuLinks = language === "bm"
    ? [
        ["Utama", "/#top"],
        ["Servis Kami", "/services"],
        ["Senang Wedding Package", "/packages"],
        ["Portfolio Acara", "/gallery"],
        ["Tentang Kami", "/vibe-check"],
        ["Hubungi Kami", "/contact"],
      ]
    : [
        ["Home", "/#top"],
        ["Our Services", "/services"],
        ["Senang Wedding Package", "/packages"],
        ["Event Portfolio", "/gallery"],
        ["About Us", "/vibe-check"],
        ["Contact Us", "/contact"],
      ];

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
      <nav className={`nav${menuOpen ? " menu-open" : ""}`} aria-label="Navigasi utama">
        <Link className="logo" href="/#top" aria-label="SenangPlanner — halaman utama">
          <Image src={publicAssetPath("/images/senangplanner-logo.png")} alt="Senang Planners — Kami Datang, Anda Senang." width={372} height={219} unoptimized />
        </Link>
        <div className="np">
          <button
            type="button"
            className="btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
          >
            {menuOpen ? (language === "bm" ? "Tutup" : "Close") : "Menu"}
          </button>
          <div className="language-switch" aria-label="Language">
            <button type="button" className={language === "bm" ? "on" : ""} onClick={() => setLanguage("bm")} aria-pressed={language === "bm"}>BM</button>
            <button type="button" className={language === "en" ? "on" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
          </div>
          <Link className="btn pk" href="/packages">{language === "bm" ? "Pakej" : "Package"}</Link>
          <Link className="btn gd" href="/contact">
            {language === "bm" ? "Bincang Acara" : "Discuss Event"} <ArrowUpRight className="i" aria-hidden="true" />
          </Link>
        </div>
      </nav>
      {menuOpen && (
        <nav className="menu on" id="main-menu" aria-label="Semua halaman">
          {menuLinks.map(([label, href]) => (
            <Link
              href={href}
              key={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
