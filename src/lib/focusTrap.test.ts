import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createFocusTrap } from './focusTrap';

describe('focusTrap', () => {
  let container: HTMLDivElement;
  let btn1: HTMLButtonElement;
  let btn2: HTMLButtonElement;
  let btn3: HTMLButtonElement;
  let cleanup: () => void;

  beforeEach(() => {
    container = document.createElement('div');
    btn1 = document.createElement('button');
    btn2 = document.createElement('button');
    btn3 = document.createElement('button');

    btn1.textContent = 'Button 1';
    btn2.textContent = 'Button 2';
    btn3.textContent = 'Button 3';

    // In JSDOM offsetParent is null, mock offsetWidth > 0
    Object.defineProperty(btn1, 'offsetWidth', { value: 50, configurable: true });
    Object.defineProperty(btn2, 'offsetWidth', { value: 50, configurable: true });
    Object.defineProperty(btn3, 'offsetWidth', { value: 50, configurable: true });

    container.appendChild(btn1);
    container.appendChild(btn2);
    container.appendChild(btn3);
    document.body.appendChild(container);

    cleanup = createFocusTrap(container);
  });

  afterEach(() => {
    cleanup();
    document.body.removeChild(container);
  });

  it('wraps focus to first element when Tab is pressed on last element', () => {
    btn3.focus();
    expect(document.activeElement).toBe(btn3);

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    container.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(btn1);
  });

  it('wraps focus to last element when Shift+Tab is pressed on first element', () => {
    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(btn3);
  });
});
