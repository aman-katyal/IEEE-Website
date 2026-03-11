import type { Committee } from "./types";

const eds: Committee = {
  id: "eds",
  name: "Electron Devices Society",
  shortName: "EDS",
  tagline: "IC and Semiconductor Design",
  description:
    "Designing and exploring integrated circuit and device technologies.",
  longDescription:
    "The Electron Devices Society (EDS) is focused on IC and semiconductor device design. Our areas of expertise include RFIC, analog/mixed-signal, digital, photonics IC, and power management IC. We provide hands-on learning with industry-standard tools for students interested in chip design and fabrication.",
  status: "Active",
  statusColor: "#00C853",
  statusBg: "rgba(0, 200, 83, 0.15)",
  image:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 25,
  founded: "2024",
  awards: 0,
  tags: ["Semiconductors", "IC Design", "Cadence", "RFIC"],
  chair: "TBD",
  email: "eds@purdueieee.org",
  projects: [
    {
      name: "Individual IC Block Design",
      description: "Designing basic blocks such as amplifiers, ADCs/DACs, PLLs, or digital blocks.",
    },
    {
      name: "RFIC & Analog/Mixed-Signal",
      description: "Simulation and layout of high-frequency and mixed-signal circuits.",
    },
    {
      name: "Photonic IC Layout",
      description: "Simulation and layout of silicon photonics and integrated optical devices.",
    },
    {
      name: "Power Management ICs (PMIC)",
      description: "Design of regulators, converters, and power delivery systems.",
    },
    {
      name: "Flagship Group Project",
      description: "Large-scale IC design project for experienced members to collaborate on a full chip tape-out.",
    },
    {
      name: "Cadence Tool Training",
      description: "Learn industry-standard tools including Virtuoso, EMX, and HFSS.",
    },
  ],
};

export default eds;
