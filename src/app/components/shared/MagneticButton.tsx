import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Link } from "react-router-dom";

interface MagneticButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "style"> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "gold";
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
  to?: string;
}

const MotionLink = motion.create(Link);

export function MagneticButton({ 
  children, 
  variant = "primary",
  strength = 0.2,
  className = "", 
  style,
  to,
  ...props 
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mouseX.set((clientX - centerX) * strength);
    mouseY.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const variantClass = variant === "primary" ? "btn-primary hover-glow-blue" : 
                       variant === "ghost" ? "btn-ghost hover-glow-gold" : 
                       "btn-gold hover-glow-gold";

  if (to) {
    return (
      <MotionLink
        to={to}
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ ...style, x, y }}
        className={`${variantClass} ${className}`}
        {...(props as any)}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, x, y }}
      className={`${variantClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

