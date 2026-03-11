import type { Committee } from "./types";

const embs: Committee = {
  id: "embs",
  name: "Engineering in Medicine & Biology Society",
  shortName: "EMBS",
  tagline: "Next-Gen Biotech Engineering",
  description:
    "Develops technology for healthcare, from exoskeletons to mechatronic devices for mental health.",
  longDescription:
    "The Engineering in Medicine and Biology Society (EMBS) develops technology for healthcare applications. Long-term goals include a full-body exoskeleton for muscular dystrophy patients and a mechatronic flower for mental health representation. The committee bridges engineering and biology to create impactful medical devices.",
  status: "Active",
  statusColor: "#00E5FF",
  statusBg: "rgba(0, 229, 255, 0.15)",
  image:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 25,
  founded: "2016",
  awards: 3,
  tags: ["Biotech", "Exoskeleton", "Medical Devices", "Mechatronics"],
  chair: "Mason Fleming",
  email: "embs@purdueieee.org",
  projects: [
    {
      name: "Full-Body Exoskeleton",
      description:
        "An assistive exoskeleton designed for individuals with muscular dystrophy, aiming to restore mobility and independence.",
    },
    {
      name: "Mechatronic Flower",
      description:
        "A responsive mechatronic device that represents mental health states, combining sensor feedback with artistic expression.",
    },
  ],
};

export default embs;
