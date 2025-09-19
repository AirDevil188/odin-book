import { render, screen, fireEvent } from "@testing-library/react";
import { it, describe, expect, vi } from "vitest";
import Input from "../components/Input/Input";

describe("Tests Input component", () => {
  it("should render input component", () => {
    render(<Input placeholder="email" />);

    const inputElement = screen.getByPlaceholderText(/email/i);
    expect(inputElement).toBeInTheDocument();
  });

  it("should render input component with name and id prop", () => {
    render(<Input id="email" name="email" placeholder="Email" />);

    const inputElement = screen.getByPlaceholderText(/email/i);

    expect(inputElement).toHaveAttribute("id", "email");
    expect(inputElement).toHaveAttribute("name", "email");
  });

  it("should render input with required attribute", () => {
    render(<Input placeholder="Email" required={true} />);

    const inputElement = screen.getByPlaceholderText(/email/i);
    expect(inputElement).toHaveAttribute("required");
  });

  it("should render password type input", () => {
    render(<Input type="password" placeholder="Password" />);

    const inputElement = screen.getByPlaceholderText(/password/i);
    expect(inputElement).toHaveAttribute("type", "password");
  });
});

it("should update the value onChange", async () => {
  const handleChange = vi.fn();
  render(<Input onChange={handleChange} placeholder="Email" />);

  const inputElement = screen.getByPlaceholderText(/email/i);

  fireEvent.change(inputElement, { target: { value: "test" } });

  expect(handleChange).toHaveBeenCalled(1);
});
