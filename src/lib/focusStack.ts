/**
 * Modal Focus Stack Manager.
 * Manages active layered dialogs, traps keyboard navigation to the topmost modal,
 * and deterministically restores focus to trigger elements upon dismissal.
 */

interface ModalEntry {
  id: string;
  triggerElement: HTMLElement | null;
  onClose?: () => void;
}

class FocusStackManager {
  private stack: ModalEntry[] = [];

  /**
   * Pushes a new modal onto the stack and records its opener element for focus restoration.
   */
  push(id: string, triggerElement?: HTMLElement | null, onClose?: () => void): void {
    // If modal already exists in stack, move it to top
    this.stack = this.stack.filter((m) => m.id !== id);
    const trigger = triggerElement || (typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null);
    this.stack.push({ id, triggerElement: trigger, onClose });
  }

  /**
   * Pops the topmost modal (or a specific modal by ID) and restores focus to its trigger element.
   */
  pop(id?: string): ModalEntry | undefined {
    if (this.stack.length === 0) return undefined;

    let popped: ModalEntry | undefined;
    if (id) {
      const idx = this.stack.findIndex((m) => m.id === id);
      if (idx !== -1) {
        popped = this.stack.splice(idx, 1)[0];
      }
    } else {
      popped = this.stack.pop();
    }

    if (popped?.triggerElement && typeof popped.triggerElement.focus === 'function') {
      popped.triggerElement.focus();
    }

    return popped;
  }

  /**
   * Returns the ID of the current topmost modal in the stack.
   */
  getTopId(): string | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1].id : null;
  }

  /**
   * Checks if a given modal ID is currently the topmost dialog.
   */
  isTop(id: string): boolean {
    return this.getTopId() === id;
  }

  /**
   * Returns current stack depth.
   */
  get size(): number {
    return this.stack.length;
  }

  /**
   * Clears the entire modal stack.
   */
  clear(): void {
    this.stack = [];
  }
}

export const focusStack = new FocusStackManager();
