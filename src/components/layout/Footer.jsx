import Link from "next/link";
import Image from "next/image";
import { siGithub, siInstagram, siWhatsapp } from "simple-icons";
import "./Footer.css";

function SocialIcon({ icon }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={icon.path} /></svg>;
}

const columns = [
  {
    heading: "NAVIGATE",
    links: [
      { href: "/", label: "Home" },
      { href: "/learn", label: "Learn" },
      { href: "/perks", label: "Perks" },
      { href: "/events", label: "Events" },
      { href: "/games", label: "Games" },
      { href: "/team", label: "Team" },
    ],
  },
  {
    heading: "COMMUNITY",
    links: [
      { href: "https://github.com/GCC-FAST-NUCES-Karachi", label: "GitHub org" },
      { href: "https://chat.whatsapp.com/EweThN5W27a4cVgFC5VyPC?s=sw&p=a&mlu=4&ilr=4", label: "WhatsApp community" },
      { href: "https://www.instagram.com/github_nu", label: "Instagram" },
      { href: "https://www.linkedin.com/company/github-campus-club-fast-nuces/", label: "LinkedIn" },
    ],
  },
  {
    heading: "BUILD",
    links: [
      { href: "https://github.com/GCC-FAST-NUCES-Karachi/GCC", label: "Open source projects" },
      { href: "https://github.com/GCC-FAST-NUCES-Karachi/GCC/blob/main/CONTRIBUTING.md", label: "Contributing" },
      { href: "mailto:github.khi@nu.edu.pk", label: "Contact us" },
    ],
  },
];

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link className="footer-logo" href="/" aria-label="GCC home">
            <Image alt="" aria-hidden="true" height={44} src="/images/brand/GitHub_Campus_Club_Logo_Compliant.svg" width={44} />
            <span>GCC</span>
          </Link>
          <p>
            A GitHub campus club for people who build things together.
          </p>
          <div aria-label="Social links" className="social-links">
            <a aria-label="GitHub" href="https://github.com/GCC-FAST-NUCES-Karachi" rel="noreferrer" target="_blank"><SocialIcon icon={siGithub} /></a>
            <a aria-label="WhatsApp community" href="https://chat.whatsapp.com/EweThN5W27a4cVgFC5VyPC?s=sw&p=a&mlu=4&ilr=4" rel="noreferrer" target="_blank"><SocialIcon icon={siWhatsapp} /></a>
            <a aria-label="Instagram" href="https://www.instagram.com/github_nu" rel="noreferrer" target="_blank"><SocialIcon icon={siInstagram} /></a>
            <a aria-label="LinkedIn" href="https://www.linkedin.com/company/github-campus-club-fast-nuces/" rel="noreferrer" target="_blank"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V9H3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z" /></svg></a>
          </div>
        </div>

        <div className="footer-columns">
          {columns.map((column) => (
            <section key={column.heading}>
              <h2>{column.heading}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={typeof link === "string" ? link : link.label}>
                    {link.href ? (
                      link.href.startsWith("/") ? (
                        <Link href={link.href}>{link.label}</Link>
                      ) : (
                        <a href={link.href} rel={link.href.startsWith("https:") ? "noreferrer" : undefined} target={link.href.startsWith("https:") ? "_blank" : undefined}>{link.label}</a>
                      )
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© GCC. Built with commits.</p>
        <p className="build-tag">main · a1b2c3d</p>
      </div>
      </footer>
    </>
  );
}
