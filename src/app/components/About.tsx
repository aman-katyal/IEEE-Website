import { Cpu, Users, Award, Globe } from "lucide-react";

const pillars = [
  {
    icon: Cpu,
    title: "Technical Excellence",
    desc: "Hands-on engineering projects spanning robotics, embedded systems, and advanced research.",
    color: "#00629B",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Connect with 750+ driven engineers, industry leaders, and like-minded innovators.",
    color: "#EBD3A9",
  },
  {
    icon: Award,
    title: "Competition",
    desc: "Represent Purdue at national and international engineering competitions year-round.",
    color: "#00629B",
  },
  {
    icon: Globe,
    title: "Industry Access",
    desc: "Direct pathways to premier industry partners and exclusive internship pipelines.",
    color: "#EBD3A9",
  },
];

export function About() {
  return (
    <section
      id="about"
      style={{
        background: "#001E3C",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.4 }}
      />

      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,98,155,0.6) 30%, rgba(235,211,169,0.4) 50%, rgba(0,98,155,0.6) 70%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,98,155,0.4) 50%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Header */}
        <div
          className="ieee-grid-2"
          style={{
            marginBottom: "72px",
          }}
        >
          <div>
            <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
              // About Purdue IEEE
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: "#F8F9FA",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "0",
              }}
            >
              The Hub of{" "}
              <span style={{ color: "#00629B" }}>Engineering</span>{" "}
              Innovation at Purdue
            </h2>
          </div>

          <div style={{ paddingTop: "8px" }}>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: "16px",
                color: "rgba(248,249,250,0.6)",
                lineHeight: 1.75,
                marginBottom: "24px",
              }}
            >
              Purdue IEEE is the largest technical student organization on campus, 
              uniting engineers across disciplines to tackle real-world challenges. 
              From deep-sea robotics to AI systems, our committees push the boundaries 
              of what's possible.
            </p>
            <button
              className="btn-gold"
              onClick={() => document.querySelector("#committees")?.scrollIntoView({ behavior: "smooth" })}
            >
              View All Committees
            </button>
          </div>
        </div>

        {/* Pillar Cards */}
        <div className="ieee-grid-4-gap">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="glass-card"
                style={{ padding: "32px 24px" }}
              >
                {/* Corner accent */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    background: `rgba(${i % 2 === 0 ? "0,98,155" : "235,211,169"}, 0.12)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    border: `1px solid ${p.color}22`,
                  }}
                >
                  <Icon size={18} style={{ color: p.color }} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#F8F9FA",
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "13.5px",
                    color: "rgba(248,249,250,0.5)",
                    lineHeight: 1.65,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}