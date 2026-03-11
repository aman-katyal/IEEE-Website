import type { Committee } from "./types";

const racing: Committee = {
  id: "racing",
  name: "Racing",
  shortName: "Racing",
  tagline: "Electric Vehicle Grand Prix",
  description:
    "Competes in evGrandPrix with driver-operated and autonomous electric karts.",
  longDescription:
    "The Racing committee competes in the Electric Vehicle Grand Prix (evGrandPrix). They maintain two karts — one driver-operated and one autonomous — with subteams for Mechanical, Controls, and Electrical systems. Members gain hands-on experience in electric vehicle design, power electronics, and autonomous driving.",
  status: "Competition",
  statusColor: "#FF3D57",
  statusBg: "rgba(255, 61, 87, 0.15)",
  image:
    "https://images.unsplash.com/photo-1771461848585-d6f00b69691e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 45,
  founded: "2012",
  awards: 6,
  tags: ["Electric Vehicles", "Autonomous", "Controls", "Power Electronics"],
  chair: "Calvin Hoang",
  email: "hoang65@purdue.edu",
  projects: [
    {
      name: "Driver-Operated Kart",
      description:
        "A custom-built electric go-kart designed for the evGrandPrix endurance race, optimizing for speed and battery efficiency.",
    },
    {
      name: "Autonomous Kart",
      description:
        "A self-driving electric kart using LiDAR, computer vision, and control algorithms to navigate the track autonomously.",
    },
  ],
};

export default racing;
