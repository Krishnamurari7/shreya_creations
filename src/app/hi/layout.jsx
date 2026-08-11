import { LanguageProvider } from "@/components/LanguageProvider";

export default function HiLayout({ children }) {
  return (
    <LanguageProvider defaultLang="hi" forceLocale>
      {children}
    </LanguageProvider>
  );
}
