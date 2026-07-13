import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";
import { IeeePurdueLogo } from "./IeeePurdueLogo";
import { useCommittees, prefetchData, useSiteSettings } from "../../../hooks/useSanityData";
import { MagneticWrapper } from "../ui/MagneticWrapper";
import { MagneticButton } from "./MagneticButton";
import groq from "groq";

const DiscordIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.077 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.077 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.419-2.157 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

export function Navigation() {
  const { committees } = useCommittees();
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState("");
  const dropdownTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const isHome = location.pathname === "/";

  const discordUrl = settings?.discordUrl || "https://discord.gg/sPPQequ9ws";

  const navLinks = [
    { 
      label: "About", 
      href: "/about",
      dropdown: [
        { label: "About Us", href: "/about" },
        { label: "Partners", href: "/partners" },
        { label: "Constitution", href: "/constitution" },
      ]
    },
    { 
      label: "Committees", 
      href: "/committees",
      dropdown: committees.map(c => ({ label: c.shortName, href: `/committee/${c.id}`, id: c.id }))
    },
    { label: "Events", href: "/calendar" },
    { label: "Officers", href: "/officers" },
    { label: "Join", href: "/join" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) window.clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);

    // Prefetch committees list if hovering over Committees
    if (label === "Committees") {
      const query = groq`*[_type == "committee"]{
        ...,
        "id": id.current,
        "image": coalesce(image.asset->url + "?auto=format&w=1200&q=75", image),
        "chair": coalesce(chair->name, chair),
        "email": coalesce(email, chair->email),
        sections[]{
          ...,
          "type": select(
            _type == "textSection" => "text",
            _type == "projectsSection" => "projects",
            _type == "faqSection" => "faq",
            _type == "gallerySection" => "gallery",
            _type == "contactSection" => "contact",
            _type
          ),
          "image": coalesce(image.asset->url + "?auto=format&q=75", image),
          items[]{
            ...,
            "image": coalesce(image.asset->url + "?auto=format&w=800&q=75", image)
          }
        }
      }`;
      prefetchData(query);
    }
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleLinkHover = (href: string, committeeId?: string) => {
    if (href === "/officers") {
      const query = groq`*[_type == "leader"] | order(order asc){
        ...,
        "image": coalesce(image.asset->url + "?auto=format&w=480&q=75", image)
      }`;
      prefetchData(query);
    } else if (committeeId) {
      const query = groq`*[_type == "committee" && id.current == $id][0]{
        ...,
        "id": id.current,
        "image": coalesce(image.asset->url + "?auto=format&w=1200&q=75", image),
        "chair": coalesce(chair->name, chair),
        "email": coalesce(email, chair->email),
        sections[]{
          ...,
          "type": select(
            _type == "textSection" => "text",
            _type == "projectsSection" => "projects",
            _type == "faqSection" => "faq",
            _type == "gallerySection" => "gallery",
            _type == "contactSection" => "contact",
            _type
          ),
          "image": coalesce(image.asset->url + "?auto=format&q=75", image),
          items[]{
            ...,
            "image": coalesce(image.asset->url + "?auto=format&w=800&q=75", image)
          }
        }
      }`;
      prefetchData(query, { id: committeeId });
    }
  };

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const handleNav = (href: string) => {
    setActiveLink(href);
    setMenuOpen(false);
    setOpenDropdown(null);

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
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 0.4s ease, border-color 0.4s ease",
          background: scrolled || menuOpen
            ? "var(--boiler-black)"
            : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          borderBottom: scrolled || menuOpen
            ? "1px solid var(--glass-border)"
            : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo Lockup */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <IeeePurdueLogo style={{ height: "40px", width: "auto" }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <span
                style={{
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "var(--text-primary)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  lineHeight: "1"
                }}
              >
                PURDUE
              </span>
              <span
                style={{
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "var(--electric-blue)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  lineHeight: "1"
                }}
              >
                IEEE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div
            className="nav-desktop-container"
            style={{
              alignItems: "center",
              gap: "24px",
            }}
          >
            {navLinks.slice(0, -1).map((link) => (
              link.dropdown ? (
                <div 
                  key={link.label} 
                  style={{ position: "relative" }}
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={link.href}
                    className="nav-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: openDropdown === link.label ? (isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)") : "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 16px",
                      margin: "16px -16px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      color: location.pathname.startsWith(link.href) || (link.label === "About" && location.pathname === "/constitution")
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                    onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                  >
                    {link.label}
                    <ChevronDown size={14} style={{ transform: openDropdown === link.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </a>
                  
                  {openDropdown === link.label && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        width: link.label === "Committees" ? "220px" : "180px",
                        background: "var(--boiler-black)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "4px",
                        padding: "8px 0",
                        marginTop: "-8px",
                        boxShadow: isLight ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" : "0 10px 30px rgba(0,0,0,0.4)",
                        backdropFilter: "blur(10px)",
                        zIndex: 110
                      }}
                    >
                      <div style={{ position: "absolute", top: "-20px", left: 0, right: 0, height: "20px" }} />
                      
                      {link.label === "Committees" && (
                        <>
                          <a
                            href="/committees"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px 20px",
                              color: "var(--electric-blue)",
                              textDecoration: "none",
                              fontSize: "0.85rem",
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              borderBottom: "1px solid var(--glass-border)",
                              background: isLight ? "rgba(0, 90, 135, 0.05)" : "rgba(0, 98, 155, 0.08)",
                            }}
                            onClick={(e) => { e.preventDefault(); handleNav("/committees"); }}
                          >
                            View All Teams
                            <ArrowUpRight size={14} />
                          </a>
                        </>
                      )}
                      
                      {link.dropdown.map((subItem: any) => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          style={{
                            display: "block",
                            padding: "10px 20px",
                            color: location.pathname === subItem.href ? "var(--electric-blue)" : "var(--text-secondary)",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            fontFamily: "var(--font-body)",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            background: location.pathname === subItem.href ? (isLight ? "rgba(0, 90, 135, 0.05)" : "rgba(0, 98, 155, 0.05)") : "transparent",
                            transformOrigin: "left",
                          }}
                          onMouseEnter={(e) => {
                            handleLinkHover(subItem.href, subItem.id);
                            const el = e.currentTarget;
                            el.style.transform = "scale(1.03) translateX(4px)";
                            el.style.color = "var(--electric-blue)";
                            el.style.background = isLight ? "rgba(0, 90, 135, 0.05)" : "rgba(0, 98, 155, 0.08)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            if (location.pathname !== subItem.href) {
                              el.style.transform = "scale(1) translateX(0)";
                              el.style.color = "var(--text-secondary)";
                              el.style.background = "transparent";
                            } else {
                              el.style.transform = "scale(1) translateX(0)";
                              el.style.background = isLight ? "rgba(0, 90, 135, 0.05)" : "rgba(0, 98, 155, 0.05)";
                            }
                          }}
                          onClick={(e) => { e.preventDefault(); handleNav(subItem.href); }}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  style={{
                    color: location.pathname === link.href
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                  onMouseEnter={() => handleLinkHover(link.href)}
                  onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                >
                  {link.label}
                </a>
              )
            ))}

            <div
              style={{
                width: "1px",
                height: "20px",
                background: "var(--glass-border)",
              }}
            />

            <ThemeToggle />

            <MagneticWrapper strength={0.1}>
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost hover-glow-gold"
                style={{ 
                  padding: "9px 16px", 
                  fontSize: "0.8rem", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  textDecoration: "none"
                }}
              >
                <DiscordIcon size={16} />
                Discord
              </a>
            </MagneticWrapper>

            <MagneticButton
              variant="primary"
              style={{ padding: "9px 22px", fontSize: "0.8rem" }}
              onClick={() => handleNav("/join")}
            >
              Join IEEE
            </MagneticButton>
          </div>

          {/* Mobile Hamburger & Toggle */}
          <div className="nav-mobile-toggle-group" style={{ alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <button
              className="nav-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              style={{
                background: isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(128, 128, 128, 0.1)",
                border: "1px solid var(--glass-border)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                cursor: "pointer",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div
            style={{
              background: "var(--boiler-black)",
              borderTop: "1px solid var(--glass-border)",
              padding: "16px 24px 48px",
              maxHeight: "calc(100vh - 72px)",
              overflowY: "auto",
              position: "absolute",
              top: "72px",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: isLight ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)" : "0 20px 40px rgba(0,0,0,0.4)",
              backdropFilter: "blur(20px)"
            }}
          >
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.dropdown ? (
                  <div style={{ marginBottom: "12px" }}>
                    <div 
                      onClick={() => handleNav(link.href)}
                      style={{ 
                        fontFamily: "var(--font-body)", 
                        fontSize: "0.8rem", 
                        color: "var(--cyber-gold)", 
                        padding: "20px 0 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        fontWeight: 600,
                        cursor: "pointer",
                        opacity: isLight ? 1 : 0.9
                      }}
                    >
                      {link.label}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {link.dropdown.map((subItem: any) => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          style={{
                            display: "block",
                            fontFamily: "var(--font-body)",
                            fontSize: "1.1rem",
                            color: location.pathname === subItem.href ? "var(--text-primary)" : "var(--text-secondary)",
                            textDecoration: "none",
                            padding: "14px 16px",
                            background: location.pathname === subItem.href ? (isLight ? "rgba(0, 90, 135, 0.08)" : "rgba(0, 98, 155, 0.1)") : (isLight ? "rgba(0,0,0,0.03)" : "rgba(128,128,128,0.05)"),
                            borderRadius: "6px",
                            borderLeft: location.pathname === subItem.href ? "3px solid var(--electric-blue)" : "3px solid transparent"
                          }}
                          onClick={(e) => { e.preventDefault(); handleNav(subItem.href); }}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      color: location.pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      padding: "18px 16px",
                      background: location.pathname === link.href ? (isLight ? "rgba(0, 90, 135, 0.08)" : "rgba(0, 98, 155, 0.1)") : (isLight ? "rgba(0,0,0,0.03)" : "rgba(128,128,128,0.05)"),
                      borderRadius: "6px",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                    onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "32px" }}>
              <MagneticWrapper strength={0.1} className="w-full">
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost hover-glow-gold w-full"
                  style={{ 
                    padding: "18px", 
                    fontSize: "1rem", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    gap: "10px",
                    textDecoration: "none"
                  }}
                >
                  <DiscordIcon size={20} />
                  Join Discord
                </a>
              </MagneticWrapper>
              <MagneticWrapper strength={0.1} className="w-full">
                <button
                  className="btn-primary hover-glow-blue w-full"
                  style={{ padding: "20px", fontSize: "1rem" }}
                  onClick={() => handleNav("/join")}
                >
                  Join IEEE
                </button>
              </MagneticWrapper>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .nav-desktop-container {
          display: none;
        }
        .nav-mobile-toggle-group {
          display: flex;
        }

        @media (min-width: 1024px) {
          .nav-desktop-container {
            display: flex;
          }
          .nav-mobile-toggle-group {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
