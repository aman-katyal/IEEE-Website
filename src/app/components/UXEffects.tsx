import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

export function UXEffects() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const { theme } = useTheme();
  const isLight = theme === "light";

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

  // Dynamic colors based on theme
  const cursorColor = isLight ? "rgba(0, 90, 135, 0.5)" : "rgba(235, 211, 169, 0.4)";
  const cursorGlow = isLight ? "rgba(0, 90, 135, 0.15)" : "rgba(235, 211, 169, 0.2)";
  const innerDotColor = isLight ? "#0F172A" : "#FFFFFF";

  return (
    <>
      {/* Custom Cursor (Visible only on desktop) */}
      {isDesktop && (
        <>
          {/* Outer Ring */}
          <motion.div
            className="pointer-events-none fixed z-[10000] rounded-full border"
            animate={{
              x: mousePosition.x - (isHovering ? 20 : 10),
              y: mousePosition.y - (isHovering ? 20 : 10),
              width: isHovering ? 40 : 20,
              height: isHovering ? 40 : 20,
              backgroundColor: isHovering ? cursorGlow : "transparent",
              borderColor: cursorColor,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.2 }}
            style={{
              boxShadow: isHovering ? `0 0 15px ${cursorGlow}` : "none"
            }}
          />
          {/* Inner Dot with mixBlendMode for contrast */}
          <motion.div
            className="pointer-events-none fixed z-[10000] w-[5px] h-[5px] rounded-full"
            animate={{
              x: mousePosition.x - 2.5,
              y: mousePosition.y - 2.5,
              opacity: isHovering ? 0 : 1,
              backgroundColor: innerDotColor
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.05 }}
            style={{
              mixBlendMode: isLight ? "normal" : "difference"
            }}
          />
        </>
      )}
    </>
  );
}
