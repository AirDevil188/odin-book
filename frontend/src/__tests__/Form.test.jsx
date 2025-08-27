import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Form from "../components/Form/Form";

describe("Form component", () => {
  it("should render form element in the document", () => {
    render(<Form></Form>);

    const formElement = screen.getByTestId("form");
    expect(formElement).toBeInTheDocument();
  });
});
