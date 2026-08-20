import { NavDropdown } from "./NavDropdown";
import { MagneticWrapper } from "../../ui/MagneticWrapper";
import { MagneticButton } from "../MagneticButton";
import { DiscordIcon } from "../../icons";
import type { NavLinkItem } from "./types";

interface DesktopNavProps {
  navLinks: NavLinkItem[];
  openDropdown: string | null;
  isLight: boolean;
  currentPath: string;
  discordUrl: string;
  onMouseEnter: (label: string) => void;
  onMouseLeave: () => void;
  onLinkHover: (href: string, id?: string) => void;
  onNavigate: (href: string) => void;
}

export function DesktopNav({
  navLinks,
  openDropdown,
  isLight,
  currentPath,
  discordUrl,
  onMouseEnter,
  onMouseLeave,
  onLinkHover,
  onNavigate,
}: DesktopNavProps) {
  return (
    <div
      className="nav-desktop-container"
      style={{
        alignItems: "center",
        gap: "24px",
      }}
    >
      {navLinks.slice(0, -1).map((link) =>
        link.dropdown ? (
          <NavDropdown
            key={link.label}
            link={link}
            isOpen={openDropdown === link.label}
            isLight={isLight}
            currentPath={currentPath}
            onMouseEnter={() => onMouseEnter(link.label)}
            onMouseLeave={onMouseLeave}
            onLinkClick={onNavigate}
            onItemHover={onLinkHover}
          />
        ) : (
          <a
            key={link.href}
            href={link.href}
            className="nav-link"
            aria-current={currentPath === link.href ? "page" : undefined}
            style={{
              color:
                currentPath === link.href
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
            }}
            onMouseEnter={() => onLinkHover(link.href)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(link.href);
            }}
          >
            {link.label}
          </a>
        )
      )}

      <MagneticWrapper strength={0.1}>
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost hover-glow-gold"
          style={{
            padding: "9px 16px",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <DiscordIcon size={16} />
          Discord
        </a>
      </MagneticWrapper>

      <MagneticButton
        variant="primary"
        style={{ padding: "9px 22px", fontSize: "0.8rem" }}
        onClick={() => onNavigate("/join")}
      >
        Join IEEE
      </MagneticButton>
    </div>
  );
}
