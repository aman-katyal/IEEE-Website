import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "./card";

describe("Card", () => {
  it("renders all card components correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <button>Footer Button</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /footer button/i })).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    render(<Card className="custom-card">Content</Card>);
    const card = screen.getByText("Content");
    expect(card).toHaveClass("custom-card");
  });
});

// Update tests to use data-slot or specific queries if needed
describe("Card Components with data-slot", () => {
  it("has correct data-slot attributes", () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Title</CardTitle>
          <CardDescription data-testid="description">Description</CardDescription>
          <CardAction data-testid="action">Action</CardAction>
        </CardHeader>
        <CardContent data-testid="content">Content</CardContent>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    );

    expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card");
    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "card-header");
    expect(screen.getByTestId("title")).toHaveAttribute("data-slot", "card-title");
    expect(screen.getByTestId("description")).toHaveAttribute("data-slot", "card-description");
    expect(screen.getByTestId("action")).toHaveAttribute("data-slot", "card-action");
    expect(screen.getByTestId("content")).toHaveAttribute("data-slot", "card-content");
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "card-footer");
  });
});
