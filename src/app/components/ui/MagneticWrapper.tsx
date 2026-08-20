import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

// ⚡ Bolt: Hoisted spring configuration outside of component to prevent re-allocation on every render
const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 };

export function MagneticWrapper({
  children,
  strength = 0.5,
  className = "",
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, SPRING_CONFIG);
  const y = useSpring(mouseY, SPRING_CONFIG);

  const handleMouseEnter = () => {
    if (!ref.current) return;
    boundsRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    if (!boundsRef.current) {
      boundsRef.current = ref.current.getBoundingClientRect();
    }

    const { clientX, clientY } = e;
    const { left, top, width, height } = boundsRef.current;

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    mouseX.set(distanceX * strength);
    mouseY.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    boundsRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
