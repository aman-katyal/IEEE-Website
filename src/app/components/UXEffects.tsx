import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function UXEffects() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Only apply custom cursor on non-touch devices
    const checkDesktop = () => setIsDesktop(window.innerWidth > 768 && window.matchMedia('(pointer: fine)').matches);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    if (!isDesktop) return;

    document.body.classList.add("custom-cursor-active");

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = target.closest("a, button, [role='button'], input, textarea, select");
      setIsHovering(!!isClickable);
    };

    // Use passive listener for better performance
    window.addEventListener("mousemove", updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener('resize', checkDesktop);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isDesktop]);

  return (
    <>
      {/* Custom Cursor (Visible only on desktop) */}
      {isDesktop && (
        <>
          {/* Outer Ring */}
          <motion.div
            className="pointer-events-none fixed z-[10000] rounded-full border border-[rgba(235,211,169,0.4)]"
            animate={{
              x: mousePosition.x - (isHovering ? 20 : 10),
              y: mousePosition.y - (isHovering ? 20 : 10),
              width: isHovering ? 40 : 20,
              height: isHovering ? 40 : 20,
              backgroundColor: isHovering ? "rgba(235, 211, 169, 0.1)" : "transparent",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.2 }}
            style={{
              boxShadow: isHovering ? "0 0 15px rgba(235, 211, 169, 0.2)" : "none"
            }}
          />
          {/* Inner Dot with mixBlendMode for contrast */}
          <motion.div
            className="pointer-events-none fixed z-[10000] w-[5px] h-[5px] bg-white rounded-full"
            animate={{
              x: mousePosition.x - 2.5,
              y: mousePosition.y - 2.5,
              opacity: isHovering ? 0 : 1
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.05 }}
            style={{
              mixBlendMode: "difference"
            }}
          />
        </>
      )}
    </>
  );
}
