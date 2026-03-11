import type { Committee } from "./types";

const aesc: Committee = {
  id: "aesc",
  name: "Aerospace and Electronic Systems Committee",
  shortName: "AESC",
  tagline: "Pushing boundaries. Breaking barriers.",
  description:
    "Joint IEEE and AIAA professional society dedicated to advancing complex systems for space, air, and ground-based applications.",
  longDescription:
    "Purdue AESC is a joint IEEE and AIAA professional society dedicated to advancing complex systems for space, air, and ground-based applications. We are a student-led team with diverse skills and passions, working on exciting projects while gaining hands-on experience in the fields that inspire us most.",
  status: "Active",
  statusColor: "#FF9900",
  statusBg: "rgba(255, 153, 0, 0.15)",
  image: "/images/committees/aesc/team_image.png",
  members: 30,
  founded: "2018",
  awards: 2,
  tags: ["Aerodynamics", "Propulsion", "Avionics", "UAV"],
  chair: "Jonah Femrite",
  email: "jfemrite@purdue.edu",
  socialLinks: [
    { platform: "Discord", url: "https://discord.gg/Mtzf6vXhNJ" }
  ],
  gallery: [
    { src: "/images/committees/aesc/people_working.png", caption: "Our team collaborating on system design" },
    { src: "/images/committees/aesc/team_image.png", caption: "AESC Team Photo" }
  ],
  projects: [
    {
      name: "Supersonic UAV (SSUAV)",
      description:
        "Aiming for first in the race to break Mach 1 with the first air-breathing drone classified as an small UAV. Our team is pushing boundaries: blending novel design with propulsion and control systems to make sub-25 kg, air-breathing, supersonic sUAV flight a reality.",
    }
  ],
  customSections: [
    {
      title: "❖ Subteams",
      content:
        "**Propulsion** — Powering the SSUAV’s supersonic flight through engine analysis and fuel system design.\n\n**Systems** — Integrating the hardware and software necessary for controlled flight.\n\n**Aerodynamics** — Designing the SSUAV for maximum stability at transonic speeds.\n\n**Structures** — Putting everything together with composite layups and wind tunnel testing to bring our design to life.\n\n**Launch** — Getting the SSUAV off the ground.",
    },
    {
      title: "❖ Engineering Exposure",
      content:
        "• AIAA & IEEE Joint Affiliation\n• Industry-standard CFD analysis (ANSYS)\n• Advanced composite manufacturing\n• Telemetry & Avionics systems integration\n• Professional design documentation",
    },
  ],
};

export default aesc;
