import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../components/Button/Button";

describe("Button component", () => {
  it("should render button element in the document", () => {
    render(<Button text="Example" />);

    const buttonElement = screen.getByRole("button", { name: /example/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Example");
  });
});
