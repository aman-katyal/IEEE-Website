import type { Committee } from "./types";

const softwareSaturdays: Committee = {
  id: "software-saturdays",
  name: "Software Saturdays",
  shortName: "Software Saturdays",
  tagline: "Software Certificate Course",
  description:
    "An 8-week certificate course teaching frameworks like React, sponsored by the College of Engineering.",
  longDescription:
    "Software Saturdays is an 8-week certificate course sponsored by the College of Engineering. It teaches software frameworks (like React) to students of all levels, from complete beginners to experienced developers. The program bridges the gap between academic CS courses and practical software engineering skills.",
  status: "Active",
  statusColor: "#00C853",
  statusBg: "rgba(0, 200, 83, 0.15)",
  image:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 60,
  founded: "2020",
  awards: 1,
  tags: ["React", "Web Dev", "Open Source", "Teaching"],
  chair: "Ryan Baker",
  email: "softsat@purdueieee.org",
  projects: [
    {
      name: "8-Week Web Dev Certificate",
      description:
        "A structured curriculum covering HTML, CSS, JavaScript, React, and deployment — open to all Purdue students regardless of major.",
    },
  ],
};

export default softwareSaturdays;
