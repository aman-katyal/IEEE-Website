import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContactLeaderModal } from "./ContactLeaderModal";

describe("ContactLeaderModal Component", () => {
  it("renders trigger and opens dialog on click with copy action", () => {
    render(
      <ContactLeaderModal
        name="John Purdue"
        role="Committee Chair"
        email="chair@purdueieee.org"
      />
    );

    const trigger = screen.getByRole("button", { name: /contact/i });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByText("Contact John Purdue")).toBeInTheDocument();
    expect(screen.getByText("chair@purdueieee.org")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy email address/i })).toBeInTheDocument();
  });
});
