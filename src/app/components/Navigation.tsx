import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Committees", href: "#committees" },
  { label: "Events", href: "/calendar" },
  { label: "Officers", href: "/officers" },
  { label: "Join", href: "#join" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    if (isHome) {
      // On home page, just scroll
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // On other pages, navigate to home + hash
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
          {/* PURDUE text */}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#F8F9FA",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            PURDUE
          </span>

          {/* Vertical Divider */}
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "linear-gradient(to bottom, transparent, rgba(248,249,250,0.35), transparent)",
              margin: "0 14px",
              flexShrink: 0,
            }}
          />

          {/* IEEE badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                background: "#00629B",
                borderRadius: "50%",
                boxShadow: "0 0 8px rgba(0,98,155,0.9)",
              }}
            />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "#F8F9FA",
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
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{
                color: activeLink === link.href
                  ? "#F8F9FA"
                  : "rgba(248, 249, 250, 0.6)",
              }}
              onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
            >
              {link.label}
            </a>
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
            onClick={() => handleNav("#join")}
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
            color: "#F8F9FA",
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
            borderTop: "1px solid rgba(235,211,169,0.1)",
            padding: "16px 32px 24px",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                fontFamily: "'IBM Plex Sans', sans-serif",
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
          ))}
        </div>
      )}
    </nav>
  );
}
