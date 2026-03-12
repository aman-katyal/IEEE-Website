import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import { IeeePurdueLogo } from "./IeeePurdueLogo";

import { committees } from "../../data/committees";

const navLinks = [
  { 
    label: "About", 
    href: "/about",
    dropdown: [
      { label: "About Us", href: "/about" },
      { label: "Constitution", href: "/constitution" },
    ]
  },
  { 
    label: "Committees", 
    href: "/committees",
    dropdown: committees.map(c => ({ label: c.shortName, href: `/committee/${c.id}` }))
  },
  { label: "Events", href: "/calendar" },
  { label: "Officers", href: "/officers" },
  { label: "Join", href: "/join" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState("");
  const dropdownTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) window.clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
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
                  fontSize: "15px",
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
                  fontSize: "15px",
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
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "24px 0",
                      textDecoration: "none",
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
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        backdropFilter: "blur(10px)",
                        zIndex: 110
                      }}
                    >
                      <div style={{ position: "absolute", top: "-20px", left: 0, right: 0, height: "20px" }} />
                      
                      {link.dropdown.map((subItem) => (
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
                            transition: "all 0.2s",
                            background: location.pathname === subItem.href ? "rgba(0, 98, 155, 0.05)" : "transparent"
                          }}
                          onClick={(e) => { e.preventDefault(); handleNav(subItem.href); }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = location.pathname === subItem.href ? "var(--electric-blue)" : "var(--text-secondary)")}
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

            <button
              className="btn-primary"
              style={{ padding: "9px 22px", fontSize: "0.8rem" }}
              onClick={() => handleNav("/join")}
            >
              Join IEEE
            </button>
          </div>

          {/* Mobile Hamburger & Toggle */}
          <div className="nav-mobile-toggle-group" style={{ alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <button
              className="nav-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "rgba(128, 128, 128, 0.1)",
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
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
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
                        cursor: "pointer"
                      }}
                    >
                      {link.label}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {link.dropdown.map((subItem) => (
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
                            background: location.pathname === subItem.href ? "rgba(0, 98, 155, 0.1)" : "rgba(128,128,128,0.05)",
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
                      background: location.pathname === link.href ? "rgba(0, 98, 155, 0.1)" : "rgba(128,128,128,0.05)",
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
            
            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: "32px", padding: "20px", fontSize: "1rem" }}
              onClick={() => handleNav("/join")}
            >
              Join IEEE
            </button>
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

        @media (min-width: 1280px) {
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
