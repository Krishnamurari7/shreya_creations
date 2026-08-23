import { hindiFontVariables } from "@/lib/fonts";

/** Load Devanagari font subsets only for Hindi routes. */
export default function HiLayout({ children }) {
  return <div className={hindiFontVariables}>{children}</div>;
}
