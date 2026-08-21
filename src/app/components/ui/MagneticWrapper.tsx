import { type ReactNode } from "react";
import { motion } from "motion/react";
import { useMagneticSpring } from "../../../hooks/useMagneticSpring";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticWrapper({
  children,
  strength = 0.5,
  className = "",
}: MagneticWrapperProps) {
  const { ref, x, y, onMouseEnter, onMouseMove, onMouseLeave } =
    useMagneticSpring<HTMLDivElement>(strength);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
