import Label from "../components/Label";

import { render, screen } from "@testing-library/react";
import { it, describe, expect } from "vitest";
import Input from "../components/Input";

describe("Label component", () => {
  it("should render label component", () => {
    render(
      <>
        <Input name="email" id="email"></Input>
        <Label text="Email" htmlFor="email"></Label>
      </>,
    );
    const labelElement = screen.getByLabelText(/email/i);

    expect(labelElement).toBeInTheDocument();
  });

  it("should render label component with htmlFor and text", () => {
    render(
      <>
        <Input name="email" id="email" type="email" />

        <Label text="Email" htmlFor="email"></Label>
      </>,
    );

    const labelElement = screen.getByText(/email/i);

    expect(labelElement).toHaveAttribute("for", "email");
  });
});
