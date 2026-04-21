import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
  it("renders correctly", () => {
    render(
      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">Account</TabsTrigger>
          <TabsTrigger value="tab-2">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Account content</TabsContent>
        <TabsContent value="tab-2">Password content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  it("shows active tab content and hides others", () => {
    render(
      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">Account</TabsTrigger>
          <TabsTrigger value="tab-2">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Account content</TabsContent>
        <TabsContent value="tab-2">Password content</TabsContent>
      </Tabs>
    );

    // Initial state: Tab 1 is active (default)
    expect(screen.getByText("Account content")).toBeInTheDocument();
    // Content is rendered but hidden if it is not selected
    // Note: Radix usually hides it via hidden attribute or styling.
    // Let's check how it's implemented.
    const passwordContent = screen.queryByText("Password content");
    // queryByText will find it in the DOM if it's there.
    // Radix TabsContent uses `forceMount` to stay in DOM. By default it is removed.
    expect(passwordContent).not.toBeInTheDocument();
  });

  it("switches tabs on click", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">Account</TabsTrigger>
          <TabsTrigger value="tab-2">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Account content</TabsContent>
        <TabsContent value="tab-2">Password content</TabsContent>
      </Tabs>
    );

    const passwordTab = screen.getByRole("tab", { name: /password/i });
    
    // Check initial state
    expect(screen.getByText("Account content")).toBeInTheDocument();
    expect(screen.queryByText("Password content")).not.toBeInTheDocument();

    // Click Password tab
    await user.click(passwordTab);
    
    // Check updated state
    expect(screen.queryByText("Account content")).not.toBeInTheDocument();
    expect(screen.getByText("Password content")).toBeInTheDocument();
    expect(passwordTab).toHaveAttribute("data-state", "active");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">Account</TabsTrigger>
          <TabsTrigger value="tab-2">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Account content</TabsContent>
        <TabsContent value="tab-2">Password content</TabsContent>
      </Tabs>
    );

    const accountTab = screen.getByRole("tab", { name: /account/i });
    
    // Focus account tab
    accountTab.focus();
    expect(accountTab).toHaveFocus();

    // Press ArrowRight to move to password tab
    await user.keyboard("{ArrowRight}");
    
    // Check if Password content is now visible
    expect(screen.getByText("Password content")).toBeInTheDocument();
  });
});
