import GalaxyBackground from "@/components/effects/GalaxyBackground";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
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
        <div className="site-content">
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
