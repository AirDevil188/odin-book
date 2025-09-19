import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "../components/Button/Button";

describe("Button component", () => {
  it("should render button element in the document", () => {
    render(<Button text="Example" />);

    const buttonElement = screen.getByRole("button", { name: /example/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Example");
  });

  it("should register onClick event", async () => {
    const mockOnClick = vi.fn();

    render(<Button onClick={mockOnClick} text={"Example"}></Button>);

    const buttonElement = screen.getByRole("button", { name: /example/i });
    fireEvent.click(buttonElement);

    expect(mockOnClick).toHaveBeenCalled(1);
  });
});
