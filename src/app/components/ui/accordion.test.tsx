import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

describe("Accordion", () => {
  it("renders correctly", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Is it accessible?")).toBeInTheDocument();
  });

  it("expands and collapses on click", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: /is it accessible\?/i });

    // Initial state: closed (Radix sets data-state on trigger and content)
    expect(trigger).toHaveAttribute("data-state", "closed");
    
    // Click to expand
    await user.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
    
    const content = screen.getByText(/yes\. it adheres to the wai-aria design pattern\./i);
    expect(content).toBeVisible();

    // Click again to collapse (collapsible prop is true)
    await user.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("handles multiple items in single mode", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole("button", { name: /item 1/i });
    const trigger2 = screen.getByRole("button", { name: /item 2/i });

    await user.click(trigger1);
    expect(trigger1).toHaveAttribute("data-state", "open");
    expect(trigger2).toHaveAttribute("data-state", "closed");

    await user.click(trigger2);
    expect(trigger1).toHaveAttribute("data-state", "closed");
    expect(trigger2).toHaveAttribute("data-state", "open");
  });
});
