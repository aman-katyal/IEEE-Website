import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LightboxModal, type LightboxImage } from "./LightboxModal";

describe("LightboxModal Component", () => {
  const images: LightboxImage[] = [
    { src: "/img1.jpg", alt: "ROV Pool Test", caption: "ROV Pool Testing" },
    { src: "/img2.jpg", alt: "Racing Car Chassis", caption: "Formula EV Chassis" },
  ];

  it("renders active image and navigates next/previous on click", () => {
    const onClose = vi.fn();

    render(
      <LightboxModal
        images={images}
        initialIndex={0}
        isOpen={true}
        onClose={onClose}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getByText("ROV Pool Testing")).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /next image/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Formula EV Chassis")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <LightboxModal
        images={images}
        isOpen={true}
        onClose={onClose}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /close lightbox/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
