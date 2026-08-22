import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Alert, AlertTitle, AlertDescription } from "./alert";

describe("Alert UI Primitive", () => {
  it("renders alert role with title and description", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Budget Limit Exceeded</AlertTitle>
        <AlertDescription>Your total purchase request exceeds remaining committee allocation.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Budget Limit Exceeded")).toBeInTheDocument();
    expect(screen.getByText(/Your total purchase request exceeds/i)).toBeInTheDocument();
  });
});
