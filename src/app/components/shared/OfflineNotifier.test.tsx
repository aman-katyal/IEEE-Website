import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToastProvider } from "../ui/toast";
import { OfflineNotifier } from "./OfflineNotifier";

describe("OfflineNotifier", () => {
  it("displays offline warning toast when offline event fires", () => {
    render(
      <ToastProvider>
        <OfflineNotifier />
      </ToastProvider>
    );

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByText("You are offline")).toBeInTheDocument();
    expect(
      screen.getByText("Cached pages and resources will continue to be available.")
    ).toBeInTheDocument();
  });

  it("displays connection restored toast when online event fires", () => {
    render(
      <ToastProvider>
        <OfflineNotifier />
      </ToastProvider>
    );

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.getByText("Connection restored")).toBeInTheDocument();
    expect(
      screen.getByText("You are back online. Live data is synchronized.")
    ).toBeInTheDocument();
  });
});
