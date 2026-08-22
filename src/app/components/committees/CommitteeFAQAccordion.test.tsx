import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CommitteeFAQAccordion, type FAQItem } from "./CommitteeFAQAccordion";

describe("CommitteeFAQAccordion Component", () => {
  const mockItems: FAQItem[] = [
    {
      question: "Do I need prior experience to join?",
      answer: "No, all skill levels and majors are welcome.",
      category: "Join",
    },
    {
      question: "What microcontrollers do you use?",
      answer: "We primarily use STM32 and ESP32 platforms.",
      category: "Technical",
    },
  ];

  it("renders all FAQ questions and categories", () => {
    render(<CommitteeFAQAccordion items={mockItems} />);

    expect(screen.getByText("Do I need prior experience to join?")).toBeInTheDocument();
    expect(screen.getByText("What microcontrollers do you use?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Technical" })).toBeInTheDocument();
  });

  it("filters questions based on search query", () => {
    render(<CommitteeFAQAccordion items={mockItems} />);

    const searchInput = screen.getByPlaceholderText("Search FAQs...");
    fireEvent.change(searchInput, { target: { value: "microcontroller" } });

    expect(screen.getByText("What microcontrollers do you use?")).toBeInTheDocument();
    expect(screen.queryByText("Do I need prior experience to join?")).not.toBeInTheDocument();
  });

  it("filters questions based on category tab selection", () => {
    render(<CommitteeFAQAccordion items={mockItems} />);

    const joinCategoryButton = screen.getByRole("button", { name: "Join" });
    fireEvent.click(joinCategoryButton);

    expect(screen.getByText("Do I need prior experience to join?")).toBeInTheDocument();
    expect(screen.queryByText("What microcontrollers do you use?")).not.toBeInTheDocument();
  });
});
