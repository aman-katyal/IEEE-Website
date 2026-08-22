import {
  Mail,
  Globe,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Slack,
  Youtube,
} from "lucide-react";
import { DiscordIcon } from "./DiscordIcon";

/**
 * Intelligent icon detection based on platform name or URL
 */
export function getPlatformIcon(
  platform: string = "",
  url: string = "",
  size: number = 16,
) {
  const combined = (platform + url).toLowerCase();
  if (combined.includes("discord")) return <DiscordIcon size={size} />;
  if (combined.includes("github")) return <Github size={size} aria-hidden="true" />;
  if (combined.includes("instagram")) return <Instagram size={size} aria-hidden="true" />;
  if (combined.includes("linkedin")) return <Linkedin size={size} aria-hidden="true" />;
  if (combined.includes("twitter") || combined.includes("x.com"))
    return <Twitter size={size} aria-hidden="true" />;
  if (combined.includes("slack")) return <Slack size={size} aria-hidden="true" />;
  if (combined.includes("youtube")) return <Youtube size={size} aria-hidden="true" />;
  if (combined.includes("mailto") || combined.includes("@"))
    return <Mail size={size} aria-hidden="true" />;
  return <Globe size={size} aria-hidden="true" />;
}
