"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const menuLinks = [
  ["Home", "/#top"],
  ["Check Tarikh", "/#tarikh"],
  ["Pakej", "/packages"],
  ["Media Gallery", "/gallery"],
  ["Vibe Check & Pasukan", "/vibe-check"],
  ["Testimoni", "/#kata"],
  ["DM Kami", "/#hubungi"],
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
      <nav className="nav" aria-label="Navigasi utama">
        <Link className="logo" href="/#top" aria-label="SenangPlanner — halaman utama">
          <Image src="/images/senangplanner-wordmark.png" alt="SenangPlanner" width={372} height={160} unoptimized />
          <span>Kami Datang, Anda Senang.</span>
        </Link>
        <div className="np">
          <button
            type="button"
            className="btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <Link className="btn pk" href="/packages">Pakej</Link>
          <Link className="btn gd" href="/booking">
            Lock Tarikh <ArrowUpRight className="i" aria-hidden="true" />
          </Link>
        </div>
      </nav>
      {menuOpen && (
        <nav className="menu on" id="main-menu" aria-label="Semua halaman">
          {menuLinks.map(([label, href], index) => (
            <Link
              className={index === 0 ? "cur" : ""}
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
