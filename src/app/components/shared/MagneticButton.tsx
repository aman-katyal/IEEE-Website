import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Link } from "react-router";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "gold";
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
};

type OmittedProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "style";

type ButtonProps = CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, OmittedProps> & { to?: never };
type LinkProps = CommonProps & Omit<import("react-router").LinkProps, OmittedProps> & { to: string };

export type MagneticButtonProps = ButtonProps | LinkProps;

const MotionLink = motion.create(Link);

export function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    variant = "primary",
    strength = 0.2,
    className = "",
    style,
    ...restProps
  } = props;

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

  if (restProps.to) {
    const { to, ...linkProps } = restProps as typeof restProps & { to: string };
    return (
      <MotionLink
        to={to}
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ ...style, x, y }}
        className={`${variantClass} ${className}`}
        {...linkProps}
      >
        {children}
      </MotionLink>
    );
  }

  const { to, ...buttonProps } = restProps as typeof restProps & { to?: never };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, x, y }}
      className={`${variantClass} ${className}`}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}

