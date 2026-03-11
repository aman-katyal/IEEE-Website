import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

const navLinks = [
  { 
    label: "About", 
    href: "/about",
    dropdown: [
      { label: "About Us", href: "/about" },
      { label: "Constitution", href: "/constitution" },
    ]
  },
  { label: "Committees", href: "/committees" },
  { label: "Events", href: "/calendar" },
  { label: "Officers", href: "/officers" },
  { label: "Join", href: "/join" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) window.clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
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
    setDropdownOpen(false);

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
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.4s ease, border-color 0.4s ease",
        background: scrolled || menuOpen
          ? "rgba(0, 0, 0, 0.95)"
          : "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled || menuOpen
          ? "1px solid rgba(235, 211, 169, 0.12)"
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
            gap: "0",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-headline)",
              fontWeight: 700,
              fontSize: "18px",
              color: "var(--stellar-white)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            PURDUE
          </span>

          <div
            style={{
              width: "1px",
              height: "24px",
              background: "rgba(248,249,250,0.2)",
              margin: "0 12px",
              flexShrink: 0,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "5px",
                height: "5px",
                background: "var(--electric-blue)",
                borderRadius: "50%",
                boxShadow: "0 0 8px rgba(0,98,155,0.9)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 700,
                fontSize: "18px",
                color: "var(--stellar-white)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              IEEE
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Hidden on mobile/small tablets */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
          className="hidden lg:flex" // Only show on large screens
        >
          {navLinks.slice(0, -1).map((link) => (
            link.dropdown ? (
              <div 
                key={link.label} 
                style={{ position: "relative" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="nav-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "24px 0",
                    color: location.pathname.startsWith(link.href) || location.pathname === "/constitution"
                      ? "var(--stellar-white)"
                      : "rgba(248, 249, 250, 0.6)",
                  }}
                >
                  {link.label}
                  <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      width: "180px",
                      background: "rgba(0, 0, 0, 0.95)",
                      border: "1px solid rgba(235, 211, 169, 0.12)",
                      borderRadius: "4px",
                      padding: "8px 0",
                      marginTop: "-8px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
                          color: location.pathname === subItem.href ? "var(--electric-blue)" : "rgba(248, 249, 250, 0.7)",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          fontFamily: "var(--font-body)",
                          transition: "all 0.2s",
                          background: location.pathname === subItem.href ? "rgba(0, 98, 155, 0.1)" : "transparent"
                        }}
                        onClick={(e) => { e.preventDefault(); handleNav(subItem.href); }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stellar-white)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = location.pathname === subItem.href ? "var(--electric-blue)" : "rgba(248, 249, 250, 0.7)")}
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
                    ? "var(--stellar-white)"
                    : "rgba(248, 249, 250, 0.6)",
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
              background: "rgba(235,211,169,0.2)",
            }}
          />

          <button
            className="btn-primary"
            style={{ padding: "9px 22px", fontSize: "0.8rem" }}
            onClick={() => handleNav("/join")}
          >
            Join IEEE
          </button>
        </div>

        {/* Hamburger Menu - Visible on mobile & tablet */}
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            color: "var(--stellar-white)",
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

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(0,0,0,0.98)",
            borderTop: "1px solid rgba(235, 211, 169, 0.1)",
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
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            backdropFilter: "blur(20px)"
          }}
        >
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.dropdown ? (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    fontFamily: "var(--font-body)", 
                    fontSize: "0.8rem", 
                    color: "var(--cyber-gold)", 
                    padding: "20px 0 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 600
                  }}>
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
                          color: location.pathname === subItem.href ? "var(--stellar-white)" : "rgba(248,249,250,0.6)",
                          textDecoration: "none",
                          padding: "14px 16px",
                          background: location.pathname === subItem.href ? "rgba(0, 98, 155, 0.15)" : "rgba(255,255,255,0.03)",
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
                    color: location.pathname === link.href ? "var(--stellar-white)" : "rgba(248,249,250,0.8)",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    padding: "18px 16px",
                    background: location.pathname === link.href ? "rgba(0, 98, 155, 0.15)" : "rgba(255,255,255,0.03)",
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
  );
}
