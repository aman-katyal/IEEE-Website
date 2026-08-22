import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ParticleNetworkCanvas } from "./ParticleNetworkCanvas";

describe("ParticleNetworkCanvas Component", () => {
  it("renders canvas element with aria-hidden attribute", () => {
    const { container } = render(<ParticleNetworkCanvas />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });
});
