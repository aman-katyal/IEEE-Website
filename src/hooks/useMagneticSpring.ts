import { useRef } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";

export const MAGNETIC_SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 };

export interface UseMagneticSpringResult<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onMouseEnter: () => void;
  onMouseMove: (e: React.MouseEvent<T>) => void;
  onMouseLeave: () => void;
}

export function useMagneticSpring<T extends HTMLElement = HTMLElement>(
  strength = 0.5
): UseMagneticSpringResult<T> {
  const ref = useRef<T>(null);
  const boundsRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, MAGNETIC_SPRING_CONFIG);
  const y = useSpring(mouseY, MAGNETIC_SPRING_CONFIG);

  const onMouseEnter = () => {
    if (!ref.current) return;
    boundsRef.current = ref.current.getBoundingClientRect();
  };

  const onMouseMove = (e: React.MouseEvent<T>) => {
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

  const onMouseLeave = () => {
    boundsRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  return { ref, x, y, onMouseEnter, onMouseMove, onMouseLeave };
}
