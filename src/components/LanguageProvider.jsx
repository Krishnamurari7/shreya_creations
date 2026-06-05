"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext({ lang: "en", setLang: () => {}, toggle: () => {} });

export function LanguageProvider({ children, defaultLang = "en" }) {
  const [lang, setLangState] = useState(defaultLang === "hi" ? "hi" : "en");

  useEffect(() => {
    const stored = localStorage.getItem("sc-lang");
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (next) => {
    const value = next === "hi" ? "hi" : "en";
    setLangState(value);
    localStorage.setItem("sc-lang", value);
    document.documentElement.lang = value === "hi" ? "hi" : "en";
  };

  const toggle = () => setLang(lang === "en" ? "hi" : "en");

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
