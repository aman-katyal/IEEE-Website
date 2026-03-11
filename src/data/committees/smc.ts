import type { Committee } from "./types";

const smc: Committee = {
  id: "smc",
  name: "Systems, Man & Cybernetics",
  shortName: "SMC",
  tagline: "Brain-Machine Interfaces",
  description:
    "Works on EEG-based brain-machine interfaces and ML-powered robotic hand control.",
  longDescription:
    "The Systems, Man, and Cybernetics (SMC) committee works on Brain-Machine Interfaces using EEG technology and Machine Learning. They are currently developing a 128-electrode EEG cap and a robotic hand controlled by brain waves. The committee pushes the boundary between human cognition and machine control.",
  status: "Research",
  statusColor: "#00629B",
  statusBg: "rgba(0, 98, 155, 0.18)",
  image:
    "https://images.unsplash.com/photo-1695902173528-0b15104c4554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  members: 30,
  founded: "2015",
  awards: 3,
  tags: ["EEG", "Machine Learning", "BCI", "Robotics"],
  chair: "Lee Haglid",
  email: "smc@purdueieee.org",
  projects: [
    {
      name: "128-Electrode EEG Cap",
      description:
        "A high-density EEG cap capable of capturing detailed brain activity for real-time brain-machine interface applications.",
    },
    {
      name: "Brain-Controlled Robotic Hand",
      description:
        "A robotic hand that responds to EEG-detected brain signals, enabling gesture control through thought alone.",
    },
  ],
};

export default smc;
