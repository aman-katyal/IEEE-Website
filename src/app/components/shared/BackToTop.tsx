import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }

      setIsVisible(currentScroll > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--glass-border)] text-[var(--cyber-gold)] shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-[var(--cyber-gold)]"
        >
          {/* Progress Ring */}
          <svg className="absolute w-12 h-12 -rotate-90 pointer-events-none" aria-hidden="true">
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-white/10"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-[var(--cyber-gold)] transition-all duration-100"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
