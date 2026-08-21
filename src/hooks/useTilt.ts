import { useRef, CSSProperties } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltOptions {
  maxTiltDeg?: number;
  scaleOnHover?: number;
}

interface TiltResult {
  ref: React.RefObject<HTMLElement | null>;
  style: CSSProperties;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export function useTilt(options: TiltOptions = {}): TiltResult {
  const { maxTiltDeg = 10, scaleOnHover = 1.02 } = options;
  const ref = useRef<HTMLElement | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springConfig = { stiffness: 200, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springScale = useSpring(scale, springConfig);

  const perspective = useTransform(springScale, () => 'perspective(800px)');

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (!boundsRef.current) boundsRef.current = ref.current.getBoundingClientRect();
    const { left, top, width, height } = boundsRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const normalX = (e.clientX - centerX) / (width / 2);
    const normalY = (e.clientY - centerY) / (height / 2);
    rotateY.set(normalX * maxTiltDeg);
    rotateX.set(-normalY * maxTiltDeg);
    scale.set(scaleOnHover);
  };

  const onMouseLeave = () => {
    boundsRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  // Build style object combining spring values
  const style = {
    transform: `${perspective.get()} rotateX(${springRotateX.get()}deg) rotateY(${springRotateY.get()}deg) scale(${springScale.get()})`,
    willChange: 'transform',
  } as CSSProperties;

  return { ref, style, onMouseMove, onMouseLeave };
}
