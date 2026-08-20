import { MagneticWrapper } from "../../ui/MagneticWrapper";
import { DiscordIcon } from "../../icons";
import type { NavLinkItem } from "./types";

interface MobileNavMenuProps {
  isOpen: boolean;
  isLight: boolean;
  navLinks: NavLinkItem[];
  currentPath: string;
  discordUrl: string;
  onNavigate: (href: string) => void;
}

export function MobileNavMenu({
  isOpen,
  isLight,
  navLinks,
  currentPath,
  discordUrl,
  onNavigate,
}: MobileNavMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-nav-menu"
      data-testid="mobile-nav-drawer"
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
        boxShadow: isLight
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          : "0 20px 40px rgba(0,0,0,0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {navLinks.map((link) => (
        <div key={link.label}>
          {link.dropdown ? (
            <div style={{ marginBottom: "12px" }}>
              <div
                onClick={() => onNavigate(link.href)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "var(--cyber-gold)",
                  padding: "20px 0 8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: isLight ? 1 : 0.9,
                }}
              >
                {link.label}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {link.dropdown.map((subItem) => (
                  <a
                    key={subItem.href}
                    href={subItem.href}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontSize: "1.1rem",
                      color:
                        currentPath === subItem.href
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      textDecoration: "none",
                      padding: "14px 16px",
                      background:
                        currentPath === subItem.href
                          ? isLight
                            ? "rgba(0, 90, 135, 0.08)"
                            : "rgba(0, 98, 155, 0.1)"
                          : isLight
                          ? "rgba(0,0,0,0.03)"
                          : "rgba(128,128,128,0.05)",
                      borderRadius: "6px",
                      borderLeft:
                        currentPath === subItem.href
                          ? "3px solid var(--electric-blue)"
                          : "3px solid transparent",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(subItem.href);
                    }}
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
                color:
                  currentPath === link.href
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                letterSpacing: "0.05em",
                textDecoration: "none",
                padding: "18px 16px",
                background:
                  currentPath === link.href
                    ? isLight
                      ? "rgba(0, 90, 135, 0.08)"
                      : "rgba(0, 98, 155, 0.1)"
                    : isLight
                    ? "rgba(0,0,0,0.03)"
                    : "rgba(128,128,128,0.05)",
                borderRadius: "6px",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.href);
              }}
            >
              {link.label}
            </a>
          )}
        </div>
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "32px",
        }}
      >
        <MagneticWrapper strength={0.1} className="w-full">
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost hover-glow-gold w-full"
            style={{
              padding: "18px",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              textDecoration: "none",
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
            onClick={() => onNavigate("/join")}
          >
            Join IEEE
          </button>
        </MagneticWrapper>
      </div>
    </div>
  );
}
