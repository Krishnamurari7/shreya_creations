"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/locale";

const LanguageContext = createContext({ lang: "en", setLang: () => {}, toggle: () => {} });

/** Locale follows URL paths: English at /, Hindi under /hi/. */
export function LanguageProvider({ children }) {
  const pathname = usePathname();
  const lang = localeFromPathname(pathname);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, toggle: () => {}, forceLocale: true }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
