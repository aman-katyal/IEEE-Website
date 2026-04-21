import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

describe("DropdownMenu", () => {
  it("renders correctly with trigger", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Open Menu")).toBeInTheDocument();
    // Content should not be visible initially
    expect(screen.queryByText("My Account")).not.toBeInTheDocument();
  });

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    // Verify dropdown content is visible
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("My Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("calls onSelect when an item is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleSelect}>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // Open
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    
    // Select item
    await user.click(screen.getByText("Profile"));

    expect(handleSelect).toHaveBeenCalledTimes(1);
    
    // Verify it's closed after selection
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });
    trigger.focus();

    // Open via Space key
    await user.keyboard(" ");
    
    expect(screen.getByRole("menu")).toBeInTheDocument();
    
    // By default first item might be focused
    // Let's press ArrowDown
    await user.keyboard("{ArrowDown}");
    
    // Press Enter to select (it should close the menu)
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
