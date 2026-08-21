import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ToastProvider, useToast } from "./toast";

const TestComponent = () => {
  const { toast, dismiss } = useToast();
  return (
    <div>
      <button
        onClick={() =>
          toast({
            title: "Settings Saved",
            description: "Your preference has been updated.",
            variant: "success",
          })
        }
      >
        Trigger Toast
      </button>
      <button onClick={() => dismiss("all")}>Dismiss All</button>
    </div>
  );
};

describe("Toast", () => {
  it("renders toast when triggered and shows title and description", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    const button = screen.getByText("Trigger Toast");
    await act(async () => {
      await user.click(button);
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Settings Saved")).toBeInTheDocument();
    expect(screen.getByText("Your preference has been updated.")).toBeInTheDocument();
  });
});
