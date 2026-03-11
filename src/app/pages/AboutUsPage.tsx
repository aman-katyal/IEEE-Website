import { useEffect } from "react";
import { motion } from "motion/react";

export function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const revealProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div style={{ paddingTop: "80px", background: "var(--boiler-black)" }}>
      <section
        id="about"
        style={{
          background: "var(--boiler-black)",
          padding: "96px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid */}
        <div
          className="ieee-grid-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.25 }}
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
          {/* Section 1: At Purdue, we strive to be the best */}
          <motion.div
            className="ieee-grid-2"
            style={{
              marginBottom: "96px",
              alignItems: "center"
            }}
            {...revealProps}
          >
            <div>
              <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                // Excellence
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  color: "var(--stellar-white)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "24px",
                }}
              >
                At Purdue, we strive to be the <span style={{ color: "var(--electric-blue)" }}>best</span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "rgba(248,249,250,0.6)",
                  lineHeight: 1.75,
                }}
              >
                Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. 
                Purdue IEEE (Eye-Triple-E) is no different. Founded in 1903, we are the largest technical organization with students 
                of every academic background. Our members work on real-world problems and advance their engineering skills.
              </p>
            </div>
            <div className="glass-card" style={{ padding: "40px", textAlign: "center", background: "rgba(0, 98, 155, 0.1)" }}>
               <h3 style={{ color: "var(--cyber-gold)", fontSize: "24px", marginBottom: "16px", fontFamily: "var(--font-headline)" }}>Established 1903</h3>
               <p style={{ color: "rgba(248,249,250,0.5)", fontSize: "14px", fontFamily: "var(--font-body)" }}>Over a century of fostering innovation and engineering excellence at Purdue University.</p>
            </div>
          </motion.div>

          {/* Section 2: Applying academics to extracurriculars */}
          <motion.div
            className="ieee-grid-2"
            style={{
              marginBottom: "96px",
              alignItems: "center"
            }}
            {...revealProps}
          >
            <div style={{ order: window.innerWidth > 640 ? 2 : 1 }}>
              <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                // Technical Growth
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  color: "var(--stellar-white)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "24px",
                }}
              >
                Applying academics to <span style={{ color: "var(--cyber-gold)" }}>extracurriculars</span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "rgba(248,249,250,0.6)",
                  lineHeight: 1.75,
                  marginBottom: "24px"
                }}
              >
                Purdue IEEE continually strives to further our goals of technical and professional growth. 
                We help our members enter their professional careers, learn engineering software and skills, 
                and socialize with others to form lasting connections inside and outside of this organization.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "rgba(248,249,250,0.6)",
                  lineHeight: 1.75,
                }}
              >
                Our teams apply the knowledge and create real-world, practical solutions to complex engineering projects.
              </p>
            </div>
            <div style={{ order: window.innerWidth > 640 ? 1 : 2 }}>
               <div className="glass-card" style={{ padding: "40px", background: "rgba(235, 211, 169, 0.05)" }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                     {["Professional Careers", "Engineering Software", "Practical Solutions", "Lasting Connections"].map(item => (
                       <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--stellar-white)", fontSize: "15px", fontFamily: "var(--font-body)" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--electric-blue)" }} />
                          {item}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>
          </motion.div>

          {/* Section 3: Connecting industry partners to talented engineers */}
          <motion.div
            className="ieee-grid-2"
            style={{
              alignItems: "center"
            }}
            {...revealProps}
          >
            <div>
              <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                // Professional Success
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  color: "var(--stellar-white)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "24px",
                }}
              >
                Connecting industry partners to <span style={{ color: "var(--electric-blue)" }}>talented</span> engineers
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "rgba(248,249,250,0.6)",
                  lineHeight: 1.75,
                  marginBottom: "24px"
                }}
              >
                Our alumni go on to utilize the skills they learn at some of the world's largest companies. We have alumni working in every sector of every industry, helping shape the future of technology.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "rgba(248,249,250,0.6)",
                  lineHeight: 1.75,
                  marginBottom: "24px"
                }}
              >
                We host regular professional networking events and company recruiting sessions - just for our members. We also host resume reviews, alumni panels, and professor talks.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "rgba(248,249,250,0.6)",
                  lineHeight: 1.75,
                }}
              >
                With Purdue IEEE, you can learn what it takes to be successful after college, whether it be in industry or academia.
              </p>
            </div>
            <div className="glass-card" style={{ padding: "40px", background: "rgba(0, 98, 155, 0.15)", borderLeft: "4px solid var(--cyber-gold)" }}>
               <p style={{ fontStyle: "italic", color: "rgba(248,249,250,0.7)", lineHeight: 1.6, fontSize: "15px", fontFamily: "var(--font-body)" }}>
                 "Our alumni go on to work at some of the world's largest companies... helping shape the future of technology."
               </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
