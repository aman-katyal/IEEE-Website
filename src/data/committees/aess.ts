import type { Committee } from "./types";

const aess: Committee = {
  id: "aess",
  name: "Aerospace & Electronic Systems Society",
  shortName: "AESS",
  tagline: "Supersonic UAV Engineering",
  description:
    "A joint committee with AIAA focused on building air-breathing drones aiming to break Mach 1.",
  longDescription:
    "The Aerospace and Electronic Systems Society (AESS) is a joint committee with AIAA. Their primary project is the Supersonic UAV (SSUAV), a sub-25 kg air-breathing drone aiming to break Mach 1. The team combines aerodynamics, propulsion, avionics, and flight control to push the boundaries of student-built unmanned aircraft.",
  status: "Active",
  statusColor: "#FF9900",
  statusBg: "rgba(255, 153, 0, 0.15)",
  image:
    "https://images.unsplash.com/photo-1770370419338-f9a813302baa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 30,
  founded: "2018",
  awards: 2,
  tags: ["Aerodynamics", "Propulsion", "Avionics", "UAV"],
  chair: "TBD",
  email: "aess@purdueieee.org",
  projects: [
    {
      name: "Supersonic UAV (SSUAV)",
      description:
        "A sub-25 kg air-breathing drone designed to break the Mach 1 barrier. Combines custom airframe design, jet-turbine propulsion, and advanced flight controls.",
    },
  ],

  // ── Optional sections (uncomment / fill in as needed) ──────────
  // meetingSchedule: "Thursdays 7-9 PM, ARMS 1028",
  // recruitmentInfo: "Open to all majors. No experience required — just a passion for flight!",
  // gallery: [
  //   { src: "/images/aess/test-flight.jpg", caption: "First test flight of SSUAV prototype" },
  // ],
  // faqs: [
  //   { question: "Do I need aerospace experience?", answer: "Not at all! We teach everything." },
  // ],
  // socialLinks: [
  //   { platform: "Instagram", url: "https://instagram.com/purdue_aess" },
  // ],
  // customSections: [
  //   { title: "Competition History", content: "Details about past competitions..." },
  // ],
};

export default aess;
