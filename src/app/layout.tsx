import type { Metadata, Viewport } from "next";
import "@fontsource/heebo/hebrew-400.css";
import "@fontsource/heebo/hebrew-500.css";
import "@fontsource/heebo/hebrew-600.css";
import "@fontsource/heebo/hebrew-700.css";
import "@fontsource/heebo/hebrew-800.css";
import "@fontsource/heebo/latin-400.css";
import "@fontsource/heebo/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "רגע · משהו קטן לדעת",
  description: "רעיונות גדולים, ברגעים קטנים. פיד של ידע, סקרנות והשראה בעברית.",
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f8f7f4" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="he" dir="rtl"><body>{children}</body></html>;
}
