import { useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "../components/ui/card";

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
              "linear-gradient(90deg, transparent 0%, var(--electric-blue) 30%, var(--cyber-gold) 50%, var(--electric-blue) 70%, transparent 100%)",
            opacity: 0.4
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
              "linear-gradient(90deg, transparent 0%, var(--electric-blue) 50%, transparent 100%)",
            opacity: 0.2
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
                  color: "var(--text-primary)",
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
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                }}
              >
                Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. 
                Purdue IEEE (Eye-Triple-E) is no different. Founded in 1903, we are the largest technical organization with students 
                of every academic background. Our members work on real-world problems and advance their engineering skills.
              </p>
            </div>
            <Card className="glass-card border-none shadow-none p-10 text-center bg-[rgba(0,98,155,0.05)]">
               <CardContent className="p-0">
                 <h3 className="text-[var(--cyber-gold)] text-2xl mb-4 font-headline">Established 1903</h3>
                 <p className="text-[var(--text-secondary)] text-sm font-body opacity-80">Over a century of fostering innovation and engineering excellence at Purdue University.</p>
               </CardContent>
            </Card>
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
            <div style={{ order: 2 }}>
              <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                // Technical Growth
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
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
                  color: "var(--text-secondary)",
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
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                }}
              >
                Our teams apply the knowledge and create real-world, practical solutions to complex engineering projects.
              </p>
            </div>
            <div style={{ order: 1 }}>
               <Card className="glass-card border-none shadow-none p-10 bg-[rgba(235,211,169,0.05)]">
                  <CardContent className="p-0">
                    <ul className="list-none p-0 m-0 flex flex-col gap-4">
                       {["Professional Careers", "Engineering Software", "Practical Solutions", "Lasting Connections"].map(item => (
                         <li key={item} className="flex items-center gap-3 text-[var(--text-primary)] text-[15px] font-body">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--electric-blue)]" />
                            {item}
                         </li>
                       ))}
                    </ul>
                  </CardContent>
               </Card>
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
                  color: "var(--text-primary)",
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
                  color: "var(--text-secondary)",
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
                  color: "var(--text-secondary)",
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
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                }}
              >
                With Purdue IEEE, you can learn what it takes to be successful after college, whether it be in industry or academia.
              </p>
            </div>
            <Card className="glass-card border-none shadow-none p-10 bg-[rgba(0,98,155,0.05)] border-l-4 border-[var(--cyber-gold)]">
               <CardContent className="p-0">
                 <p className="italic text-[var(--text-secondary)] leading-relaxed text-[15px] font-body">
                   "Our alumni go on to work at some of the world's largest companies... helping shape the future of technology."
                 </p>
               </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
