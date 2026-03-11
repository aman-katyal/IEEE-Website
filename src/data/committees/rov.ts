import type { Committee } from "./types";

const rov: Committee = {
  id: "rov",
  name: "Remotely Operated Vehicle",
  shortName: "ROV",
  tagline: "Underwater Robotics Engineering",
  description:
    "Designs and builds underwater robots for the MATE International ROV Competition. Placed 6th at 2024 Worlds.",
  longDescription:
    "The ROV committee designs and builds underwater robots for the MATE International ROV Competition. Their recent vehicle, X15 ISO-Squid, placed 6th overall in the 2024 World Championship. The team spans mechanical design, electrical systems, embedded software, and underwater controls.",
  status: "Active",
  statusColor: "#00E5FF",
  statusBg: "rgba(0, 229, 255, 0.15)",
  image:
    "https://images.unsplash.com/photo-1754297813553-43eb3a9f65a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 42,
  founded: "2008",
  awards: 7,
  tags: ["Mechanical", "Embedded", "Controls", "Underwater"],
  chair: "Rhea Virk",
  email: "rov@purdueieee.org",
  projects: [
    {
      name: "X15 ISO-Squid",
      description:
        "The 2024 competition ROV that placed 6th at the MATE World Championship. Features custom thrusters, gripper mechanisms, and real-time control.",
    },
  ],
};

export default rov;
