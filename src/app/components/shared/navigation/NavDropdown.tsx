import { ChevronDown, ArrowUpRight } from "lucide-react";
import type { NavLinkItem } from "./types";

interface NavDropdownProps {
  link: NavLinkItem;
  isOpen: boolean;
  isLight: boolean;
  currentPath: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: (href: string) => void;
  onItemHover: (href: string, id?: string) => void;
}

export function NavDropdown({
  link,
  isOpen,
  isLight,
  currentPath,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
  onItemHover,
}: NavDropdownProps) {
  const isLinkActive =
    currentPath.startsWith(link.href) ||
    (link.label === "About" && currentPath === "/constitution");

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <a
        href={link.href}
        className="nav-link"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-current={isLinkActive ? "page" : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: isOpen
            ? isLight
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.05)"
            : "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 16px",
          margin: "16px -16px",
          borderRadius: "4px",
          textDecoration: "none",
          transition: "all 0.3s ease",
          color: isLinkActive ? "var(--text-primary)" : "var(--text-secondary)",
        }}
        onClick={(e) => {
          e.preventDefault();
          onLinkClick(link.href);
        }}
      >
        {link.label}
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </a>

      {isOpen && link.dropdown && (
        <div
          data-testid={`nav-dropdown-${link.label.toLowerCase()}`}
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            width: link.label === "Committees" ? "320px" : "180px",
            maxHeight: "min(85vh, 560px)",
            background: "var(--boiler-black)",
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            marginTop: "-4px",
            boxShadow: isLight
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              : "0 10px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 110,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: 0,
              right: 0,
              height: "20px",
            }}
          />

          {link.label === "Committees" && (
            <a
              href="/committees"
              aria-current={currentPath === "/committees" ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                color: "var(--electric-blue)",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid var(--glass-border)",
                background: isLight
                  ? "rgba(0, 90, 135, 0.05)"
                  : "rgba(0, 98, 155, 0.08)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isLight
                  ? "rgba(0, 90, 135, 0.12)"
                  : "rgba(0, 98, 155, 0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isLight
                  ? "rgba(0, 90, 135, 0.05)"
                  : "rgba(0, 98, 155, 0.08)";
              }}
              onClick={(e) => {
                e.preventDefault();
                onLinkClick("/committees");
              }}
            >
              View All Committees
              <ArrowUpRight size={14} />
            </a>
          )}

          <div style={{ padding: "4px" }}>
            {link.dropdown.map((subItem) => {
              const isSubItemActive = currentPath === subItem.href;
              return (
                <div key={subItem.href}>
                  {subItem.dividerBefore && (
                    <div
                      role="separator"
                      style={{
                        height: "1px",
                        background: "var(--glass-border)",
                        margin: "6px 8px",
                      }}
                    />
                  )}
                  <a
                    href={subItem.href}
                    aria-current={isSubItemActive ? "page" : undefined}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      color: isSubItemActive
                        ? "var(--electric-blue)"
                        : "var(--text-secondary)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-body)",
                      transition: "color 0.2s ease, background 0.2s ease",
                      background: isSubItemActive
                        ? isLight
                          ? "rgba(0, 90, 135, 0.08)"
                          : "rgba(0, 98, 155, 0.1)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      onItemHover(subItem.href, subItem.id);
                      const el = e.currentTarget;
                      el.style.color = "var(--electric-blue)";
                      el.style.background = isLight
                        ? "rgba(0, 90, 135, 0.08)"
                        : "rgba(0, 98, 155, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      if (currentPath !== subItem.href) {
                        el.style.color = "var(--text-secondary)";
                        el.style.background = "transparent";
                      } else {
                        el.style.color = "var(--electric-blue)";
                        el.style.background = isLight
                          ? "rgba(0, 90, 135, 0.08)"
                          : "rgba(0, 98, 155, 0.1)";
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onLinkClick(subItem.href);
                    }}
                  >
                    {subItem.label}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
