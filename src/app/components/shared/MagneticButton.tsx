import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useMagneticSpring } from "../../../hooks/useMagneticSpring";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "gold";
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
};

type OmittedProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "style";

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, OmittedProps> & {
    to?: never;
  };
type LinkProps = CommonProps &
  Omit<import("react-router").LinkProps, OmittedProps> & { to: string };

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

  const { ref, x, y, onMouseEnter, onMouseMove, onMouseLeave } =
    useMagneticSpring<HTMLButtonElement & HTMLAnchorElement>(strength);

  const variantClass =
    variant === "primary"
      ? "btn-primary hover-glow-blue"
      : variant === "ghost"
        ? "btn-ghost hover-glow-gold"
        : "btn-gold hover-glow-gold";

  if (restProps.to) {
    const { to, ...linkProps } = restProps as typeof restProps & { to: string };
    return (
      <MotionLink
        to={to}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
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
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, x, y }}
      className={`${variantClass} ${className}`}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
