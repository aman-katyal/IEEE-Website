import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DiscordCallout } from "./DiscordCallout";

describe("DiscordCallout Component", () => {
  it("renders Discord callout with online count and server invite link", () => {
    render(<DiscordCallout memberCount="2,000+" onlineCount={210} />);

    expect(screen.getByText(/Join the Community Discord/i)).toBeInTheDocument();
    expect(screen.getByText("210 Online")).toBeInTheDocument();
    expect(screen.getByText(/Connect with 2,000\+ Purdue engineers/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /join server/i })).toHaveAttribute(
      "href",
      "https://discord.gg/purdueieee"
    );
  });
});
