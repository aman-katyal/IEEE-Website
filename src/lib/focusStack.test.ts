import { describe, it, expect, beforeEach } from 'vitest';
import { focusStack } from './focusStack';

describe('FocusStackManager', () => {
  beforeEach(() => {
    focusStack.clear();
    document.body.innerHTML = '';
  });

  it('manages modal stack order correctly', () => {
    focusStack.push('modal-1');
    focusStack.push('modal-2');

    expect(focusStack.size).toBe(2);
    expect(focusStack.getTopId()).toBe('modal-2');
    expect(focusStack.isTop('modal-2')).toBe(true);
    expect(focusStack.isTop('modal-1')).toBe(false);
  });

  it('restores focus to trigger element when popped', () => {
    const btn1 = document.createElement('button');
    btn1.id = 'trigger-1';
    document.body.appendChild(btn1);
    btn1.focus();

    focusStack.push('modal-1', btn1);

    const btn2 = document.createElement('button');
    btn2.id = 'trigger-2';
    document.body.appendChild(btn2);
    btn2.focus();

    focusStack.push('modal-2', btn2);

    // Pop modal-2 -> focus should return to btn2
    focusStack.pop();
    expect(document.activeElement).toBe(btn2);
    expect(focusStack.getTopId()).toBe('modal-1');

    // Pop modal-1 -> focus should return to btn1
    focusStack.pop();
    expect(document.activeElement).toBe(btn1);
    expect(focusStack.size).toBe(0);
  });

  it('supports popping specific modal by id', () => {
    focusStack.push('modal-1');
    focusStack.push('modal-2');
    focusStack.push('modal-3');

    focusStack.pop('modal-2');
    expect(focusStack.size).toBe(2);
    expect(focusStack.getTopId()).toBe('modal-3');
  });
});
