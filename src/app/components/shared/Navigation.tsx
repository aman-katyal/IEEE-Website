import { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import groq from "groq";

import { IeeePurdueLogo } from "./IeeePurdueLogo";
import { useCommittees, prefetchData, useSiteSettings } from "../../../hooks/useSanityData";
import {
  useScrollHeader,
  DesktopNav,
  MobileNavMenu,
  type NavLinkItem,
} from "./navigation/index";

export function Navigation() {
  const { committees } = useCommittees();
  const { settings } = useSiteSettings();
  const scrolled = useScrollHeader(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [, setActiveLink] = useState("");
  const dropdownTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const isHome = location.pathname === "/";

  const discordUrl = settings?.discordUrl || "https://discord.gg/sPPQequ9ws";

  const navLinks: NavLinkItem[] = useMemo(() => [
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
      dropdown: [
        ...committees.map((c) => ({ label: c.shortName, href: `/committee/${c.id}`, id: c.id })),
        {
          label: "Involvement",
          href: "/committees?tab=involvement",
          dividerBefore: committees.length > 0,
        },
        {
          label: "Operations",
          href: "/committees?tab=operations",
        },
      ]
    },
    { label: "Events", href: "/calendar" },
    { label: "Officers", href: "/officers" },
    { label: "Join", href: "/join" },
  ], [committees]);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) window.clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);

    // Prefetch committees list if hovering over Committees
    if (label === "Committees") {
      const query = groq`*[_type == "committee"] | order(name asc){
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
    // Speculative route chunk prefetching
    switch (href) {
      case "/about":
        import("../../pages/AboutUsPage");
        break;
      case "/committees":
        import("../../pages/CommitteesPage");
        break;
      case "/officers":
        import("../../pages/OfficersPage");
        break;
      case "/calendar":
        import("../../pages/CalendarPage");
        break;
      case "/join":
        import("../../pages/JoinPage");
        break;
      case "/partners":
        import("../../pages/PartnersPage");
        break;
      case "/constitution":
        import("../../pages/ConstitutionPage");
        break;
      case "/finance":
        import("../../pages/FinancePortalPage");
        break;
    }

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
          <DesktopNav
            navLinks={navLinks}
            openDropdown={openDropdown}
            isLight={isLight}
            currentPath={location.pathname}
            discordUrl={discordUrl}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onLinkHover={handleLinkHover}
            onNavigate={handleNav}
          />

          {/* Mobile Hamburger */}
          <div className="nav-mobile-toggle-group" style={{ alignItems: "center", gap: "12px" }}>
            <button
              className="nav-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
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
        <MobileNavMenu
          isOpen={menuOpen}
          isLight={isLight}
          navLinks={navLinks}
          currentPath={location.pathname}
          discordUrl={discordUrl}
          onNavigate={handleNav}
          onClose={() => setMenuOpen(false)}
        />
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
