import GalaxyBackground from "@/components/effects/GalaxyBackground";
import SiteChrome from "@/components/layout/SiteChrome";
import Terminal from "@/components/terminal/Terminal.jsx";
import { TerminalProvider } from "@/components/terminal/TerminalProvider.jsx";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/Inter-Variable.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
const jetBrainsMono = localFont({
  src: "../../public/fonts/JetBrainsMono-Variable.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: {
    default: "GitHub Campus Club FAST-NUCES",
    template: "%s | GCC FAST-NUCES",
  },
  description: "A community for students who ship code and build the future together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body>
        <GalaxyBackground />
        <TerminalProvider>
          <div className="site-content"><SiteChrome>{children}</SiteChrome></div>
          <Terminal />
        </TerminalProvider>
      </body>
    </html>
  );
}

