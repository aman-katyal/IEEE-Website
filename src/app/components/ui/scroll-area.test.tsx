import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea UI Primitive", () => {
  it("renders scrollable viewport content", () => {
    render(
      <ScrollArea className="h-40 w-40">
        <div>Long scrollable content body</div>
      </ScrollArea>
    );

    expect(screen.getByText("Long scrollable content body")).toBeInTheDocument();
  });
});
