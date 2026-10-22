import Navbar from "./Navbar";
import Footer from "./Footer";
import SiteChromeClient from "./SiteChromeClient";

export default function SiteChrome({ children }) {
  return (
    <SiteChromeClient navbar={<Navbar />} footer={<Footer />}>
      {children}
    </SiteChromeClient>
  );
}
