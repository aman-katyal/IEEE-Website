import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

describe("Dialog", () => {
  it("renders correctly with trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description content.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    // Content should not be in the document initially
    expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
  });

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description content.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open dialog/i }));

    // Verify dialog content is visible
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog description content.")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <div>Some content</div>
        </DialogContent>
      </Dialog>
    );

    // Open
    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close using the X button (Radix provides a close button by default in our UI component)
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    // Verify it's closed
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes when clicking outside (on overlay)", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    // Open
    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Click outside on the overlay
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    if (overlay) {
      await user.click(overlay);
    }
    
    // Wait for it to close
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
