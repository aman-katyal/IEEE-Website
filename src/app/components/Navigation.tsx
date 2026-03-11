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

  // Handle hash scrolling after navigation
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
        background: scrolled
          ? "rgba(0, 0, 0, 0.92)"
          : "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(235, 211, 169, 0.12)"
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
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
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            PURDUE
          </span>

          <div
            style={{
              width: "1px",
              height: "28px",
              background: "linear-gradient(to bottom, transparent, rgba(248,249,250,0.35), transparent)",
              margin: "0 14px",
              flexShrink: 0,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
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
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              IEEE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
          className="hidden md:flex"
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
                    {/* Transparent bridge to prevent closing when moving to menu */}
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

          {/* Vertical divider */}
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "var(--stellar-white)",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(0,0,0,0.97)",
            borderTop: "1px solid rgba(235, 211, 169, 0.1)",
            padding: "16px 32px 24px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.dropdown ? (
                <>
                  <div style={{ 
                    fontFamily: "var(--font-body)", 
                    fontSize: "0.9rem", 
                    color: "var(--cyber-gold)", 
                    padding: "12px 0 4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em"
                  }}>
                    {link.label}
                  </div>
                  {link.dropdown.map((subItem) => (
                    <a
                      key={subItem.href}
                      href={subItem.href}
                      style={{
                        display: "block",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        color: "rgba(248,249,250,0.7)",
                        letterSpacing: "0.05em",
                        textDecoration: "none",
                        padding: "10px 16px",
                        borderLeft: "1px solid rgba(0, 98, 155, 0.3)",
                        margin: "4px 0",
                      }}
                      onClick={(e) => { e.preventDefault(); handleNav(subItem.href); }}
                    >
                      {subItem.label}
                    </a>
                  ))}
                </>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "rgba(248,249,250,0.7)",
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(235,211,169,0.05)",
                    textTransform: "uppercase",
                  }}
                  onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
