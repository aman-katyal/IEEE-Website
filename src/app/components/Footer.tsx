import { Github, Linkedin, Instagram, Twitter, ExternalLink } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { committees } from "../../data/committees";

const footerCommitteeLinks = committees.map((c) => ({
  label: c.shortName,
  to: `/committee/${c.id}`,
}));

const footerLinks = {
  Organization: [
    { label: "About IEEE", href: "/about" },
    { label: "Leadership Team", href: "/officers" },
    { label: "Constitution", href: "/constitution" },
  ],
  Resources: [
    { label: "IEEE.org", href: "https://ieee.org", external: true },
    { label: "Workshops", href: "/calendar" },
    { label: "Member Portal", href: "https://ieee.org", external: true },
  ],
  Connect: [
    { label: "Contact Us", href: "/join" },
    { label: "Industry Partners", href: "#about" },
    { label: "Join IEEE", href: "/join" },
  ],
};

const socials = [
  { Icon: Github, label: "GitHub", href: "https://github.com/PurdueIEEE" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/purdue-ieee" },
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/purdueieee" },
  { Icon: Twitter, label: "Twitter", href: "https://twitter.com/purdueieee" },
];

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleHashNav = (href: string) => {
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    if (isHome) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  return (
    <footer
      style={{
        background: "var(--boiler-black)",
        borderTop: "1px solid rgba(235,211,169,0.08)",
        paddingTop: "72px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top row: brand + tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "56px",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          <div style={{ maxWidth: "320px" }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                marginBottom: "16px",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "var(--stellar-white)",
                  letterSpacing: "0.18em",
                }}
              >
                PURDUE
              </span>
              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "rgba(248,249,250,0.2)",
                  margin: "0 14px",
                }}
              />
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  background: "var(--electric-blue)",
                  borderRadius: "50%",
                  marginRight: "8px",
                  boxShadow: "0 0 8px rgba(0,98,155,0.9)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "var(--stellar-white)",
                  letterSpacing: "0.22em",
                }}
              >
                IEEE
              </span>
            </Link>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "rgba(248,249,250,0.35)",
                lineHeight: 1.7,
              }}
            >
              Purdue University's premier IEEE student branch. Fostering technological
              innovation and excellence for the benefit of humanity since 1903.
            </p>
          </div>

          {/* Socials */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: "rgba(248,249,250,0.25)",
                textTransform: "uppercase",
              }}
            >
              Find us online
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(235,211,169,0.12)",
                    borderRadius: "4px",
                    color: "rgba(248,249,250,0.4)",
                    textDecoration: "none",
                    transition: "border-color 0.25s ease, color 0.25s ease, background 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "rgba(0,98,155,0.6)";
                    el.style.color = "var(--electric-blue)";
                    el.style.background = "rgba(0,98,155,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "rgba(235,211,169,0.12)";
                    el.style.color = "rgba(248,249,250,0.4)";
                    el.style.background = "transparent";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div
          className="ieee-grid-footer"
          style={{
            paddingBottom: "56px",
            borderBottom: "1px solid rgba(235,211,169,0.07)",
          }}
        >
          {/* Committees column — uses react-router Links */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "var(--electric-blue)",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Committees
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {footerCommitteeLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "rgba(248,249,250,0.35)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--stellar-white)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,249,250,0.35)";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Other link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.18em",
                  color: "var(--electric-blue)",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                {section}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={(link as any).external ? link.href : link.href}
                    target={(link as any).external ? "_blank" : undefined}
                    rel={(link as any).external ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!(link as any).external) {
                        e.preventDefault();
                        handleHashNav(link.href);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "rgba(248,249,250,0.35)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--stellar-white)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,249,250,0.35)";
                    }}
                  >
                    {link.label}
                    {(link as any).external && (
                      <ExternalLink size={10} />
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 0",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: "rgba(248,249,250,0.2)",
            }}
          >
            © 2026 Purdue IEEE Student Branch · All rights reserved
          </span>

          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {["Privacy Policy", "Terms of Use", "Accessibility"].map((item) => (
              <a
                key={item}
                href="https://ieee.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.1em",
                  color: "rgba(248,249,250,0.18)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,249,250,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,249,250,0.18)";
                }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Version tag */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              color: "rgba(0,98,155,0.4)",
            }}
          >
            v2.6.0 · SPRING_2026
          </div>
        </div>
      </div>
    </footer>
  );
}