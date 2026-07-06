import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock PointerEvent for Radix UI
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
    }
  }
  // @ts-ignore - ignore PointerEvent typing in global
  global.PointerEvent = PointerEvent;
}

// Mock Framer Motion (motion/react)
const stripMotionProps = ({
  initial,
  animate,
  exit,
  variants,
  transition,
  whileHover,
  whileTap,
  whileInView,
  viewport,
  layout,
  ...props
}: any) => props;

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...stripMotionProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...stripMotionProps(props)}>{children}</button>,
    h1: ({ children, ...props }: any) => <h1 {...stripMotionProps(props)}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...stripMotionProps(props)}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...stripMotionProps(props)}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...stripMotionProps(props)}>{children}</span>,
    a: ({ children, ...props }: any) => <a {...stripMotionProps(props)}>{children}</a>,
    section: ({ children, ...props }: any) => <section {...stripMotionProps(props)}>{children}</section>,
    create: (component: any) => component,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  LayoutGroup: ({ children }: any) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { onChange: vi.fn() } }),
  useSpring: (v: any) => v,
  useTransform: (v: any) => v,
  useMotionValue: (v: any) => ({ get: () => v, set: vi.fn() }),
}));
