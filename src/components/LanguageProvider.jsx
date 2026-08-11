"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext({ lang: "en", setLang: () => {}, toggle: () => {} });

export function LanguageProvider({ children, defaultLang = "en", forceLocale = false }) {
  const initial = defaultLang === "hi" ? "hi" : "en";
  const [lang, setLangState] = useState(initial);

  useEffect(() => {
    if (forceLocale) {
      setLangState(initial);
      return;
    }
    const stored = localStorage.getItem("sc-lang");
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, [forceLocale, initial]);

  const setLang = (next) => {
    const value = next === "hi" ? "hi" : "en";
    setLangState(value);
    if (!forceLocale) {
      localStorage.setItem("sc-lang", value);
    }
    document.documentElement.lang = value === "hi" ? "hi" : "en";
  };

  const toggle = () => setLang(lang === "en" ? "hi" : "en");

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, forceLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
