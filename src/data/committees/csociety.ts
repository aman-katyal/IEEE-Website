import type { Committee } from "./types";

const csociety: Committee = {
  id: "csociety",
  name: "Computer Society",
  shortName: "CSociety",
  tagline: "Hardware & Software Innovation",
  description:
    "Focuses on hardware and software projects from autonomous robots to custom CPUs.",
  longDescription:
    "The Computer Society (CSociety) focuses on a blend of hardware and software projects. Past projects include Autonomous Maze-Solving Robots, a custom Wiki built in Go, and an 8-bit Breadboard CPU. Members gain experience across embedded systems, software engineering, and computer architecture.",
  status: "Active",
  statusColor: "#00C853",
  statusBg: "rgba(0, 200, 83, 0.15)",
  image:
    "https://images.unsplash.com/photo-1739184523594-564cb9b61126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 40,
  founded: "2010",
  awards: 4,
  tags: ["Embedded", "Software", "CPU Design", "Robotics"],
  chair: "Aniket Iyer",
  email: "csociety-officers@lists.purdueieee.org",
  projects: [
    {
      name: "Autonomous Maze-Solving Robot",
      description:
        "A robot that can autonomously navigate and solve complex mazes using sensor fusion and pathfinding algorithms.",
    },
    {
      name: "Custom Wiki (Go)",
      description:
        "A lightweight wiki platform built from scratch in Go, designed for internal knowledge sharing.",
    },
    {
      name: "8-bit Breadboard CPU",
      description:
        "A fully functional 8-bit CPU built on breadboards, demonstrating computer architecture fundamentals.",
    },
  ],

  // ── Optional sections ──────────────────────────────────────────
  // meetingSchedule: "Tuesdays 6-8 PM, EE 206",
  // recruitmentInfo: "All skill levels welcome. Great for CS, CE, and EE students.",
  // gallery: [],
  // faqs: [],
  // socialLinks: [],
  // customSections: [],
};

export default csociety;
