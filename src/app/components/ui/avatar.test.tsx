import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar UI Primitive", () => {
  it("renders fallback initials when image is not loaded", () => {
    render(
      <Avatar>
        <AvatarImage src="/invalid-image.jpg" alt="Officer Portrait" />
        <AvatarFallback>JK</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("JK")).toBeInTheDocument();
  });
});
