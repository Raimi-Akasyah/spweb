"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteLanguage = "bm" | "en";

type LanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "bm",
  setLanguage: () => undefined,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("bm");

  useEffect(() => {
    const stored = window.localStorage.getItem("senang-language");
    if (stored === "bm" || stored === "en") setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "bm" ? "ms" : "en";
  }, [language]);

  function setLanguage(nextLanguage: SiteLanguage) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("senang-language", nextLanguage);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
