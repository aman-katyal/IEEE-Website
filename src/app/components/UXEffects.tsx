import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useTheme } from "next-themes";

export function UXEffects() {
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Use MotionValues to avoid React re-renders on mousemove
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer ring
  const springConfig = { stiffness: 400, damping: 30, mass: 0.2 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only apply custom cursor on non-touch devices
    const checkDesktop = () => setIsDesktop(window.innerWidth > 768 && window.matchMedia('(pointer: fine)').matches);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    if (!isDesktop) return;

    document.body.classList.add("custom-cursor-active");

    const updateMousePosition = (e: MouseEvent) => {
      // Direct update of motion values doesn't trigger React re-render
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
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
  }, [isDesktop, mouseX, mouseY]);

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
            className="pointer-events-none fixed z-[10000] rounded-full border will-change-transform"
            style={{
              x: springX,
              y: springY,
              translateX: isHovering ? -20 : -10,
              translateY: isHovering ? -20 : -10,
              width: isHovering ? 40 : 20,
              height: isHovering ? 40 : 20,
              backgroundColor: isHovering ? cursorGlow : "transparent",
              borderColor: cursorColor,
              boxShadow: isHovering ? `0 0 15px ${cursorGlow}` : "none",
            }}
          />
          {/* Inner Dot with mixBlendMode for contrast */}
          <motion.div
            className="pointer-events-none fixed z-[10000] w-[5px] h-[5px] rounded-full will-change-transform"
            style={{
              x: mouseX,
              y: mouseY,
              translateX: -2.5,
              translateY: -2.5,
              opacity: isHovering ? 0 : 1,
              backgroundColor: innerDotColor,
              mixBlendMode: isLight ? "normal" : "difference"
            }}
          />
        </>
      )}
    </>
  );
}
