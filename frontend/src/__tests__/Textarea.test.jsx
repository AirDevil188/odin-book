import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Textarea from "../components/Textarea/Textarea";

describe("Test textarea component", () => {
  it("should render textarea component", () => {
    render(<Textarea></Textarea>);

    const textareaElement = screen.getByRole("textbox");

    expect(textareaElement).toBeInTheDocument();
  });

  it("should render textarea with id and name", () => {
    render(<Textarea id={"bio"} name={"bio"}></Textarea>);

    const textareaElement = screen.getByRole("textbox");

    expect(textareaElement).toHaveAttribute("id", "bio");
    expect(textareaElement).toHaveAttribute("name", "bio");
  });

  it("should update onChange value", () => {
    const mockOnChange = vi.fn();

    render(<Textarea onChange={mockOnChange}></Textarea>);

    const textareaElement = screen.getByRole("textbox");

    fireEvent.change(textareaElement, { target: { value: "This is my bio" } });

    expect(mockOnChange).toHaveBeenCalled(1);
  });
});
