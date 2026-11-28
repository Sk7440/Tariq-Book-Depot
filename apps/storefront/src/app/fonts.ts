import { Newsreader, Noto_Nastaliq_Urdu, Plus_Jakarta_Sans } from "next/font/google";

/** The HTML's three families, self-hosted by next/font. CSS reads them via --font-* variables (styles/tokens.css). */
export const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-newsreader", display: "swap" });
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
/** Only Urdu pages use this family, so the browser downloads it only there. */
export const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "600"], variable: "--font-nastaliq", display: "swap", preload: false });

export const fontVariables = `${newsreader.variable} ${jakarta.variable} ${nastaliq.variable}`;
