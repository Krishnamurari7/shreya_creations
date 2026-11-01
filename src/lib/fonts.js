import {
  Cormorant_Garamond,
  Kaushan_Script,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
  Playfair_Display,
  Poppins,
} from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
  preload: false,
});

export const kaushan = Kaushan_Script({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-kaushan",
  preload: false,
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
  preload: false,
});

export const notoSerifHi = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif-hi",
  preload: false,
});

export const notoSansHi = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-hi",
  preload: false,
});

/** CSS variable class string for <html> — Latin fonts only (Hindi fonts load under /hi/). */
export const latinFontVariables = [
  poppins.variable,
  playfair.variable,
  kaushan.variable,
  cormorant.variable,
].join(" ");

export const hindiFontVariables = [notoSerifHi.variable, notoSansHi.variable].join(" ");
