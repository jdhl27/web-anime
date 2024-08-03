import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../../../src/components/Input/Input";

describe("Input component", () => {
  const handleValueInput = jest.fn();

  test("renders correctly", () => {
    render(<Input handleValueInput={handleValueInput} />);
    expect(screen.getByPlaceholderText("Find an anime...")).toBeInTheDocument();
  });

  test("sets isActive state on focus and blur", () => {
    render(<Input handleValueInput={handleValueInput} />);
    const inputElement = screen.getByPlaceholderText("Find an anime...");

    fireEvent.focus(inputElement);
    expect(inputElement.closest(".container-input")).toHaveClass("active");

    fireEvent.blur(inputElement);
    expect(inputElement.closest(".container-input")).not.toHaveClass("active");
  });

  test("handles input value changes", () => {
    render(<Input handleValueInput={handleValueInput} />);
    const inputElement = screen.getByPlaceholderText("Find an anime...");

    fireEvent.change(inputElement, { target: { value: "Naruto" } });
    expect(inputElement).toHaveValue("Naruto");
  });

  test("calls handleValueInput on Enter key press", () => {
    render(<Input handleValueInput={handleValueInput} />);
    const inputElement = screen.getByPlaceholderText("Find an anime...");

    fireEvent.change(inputElement, { target: { value: "Naruto" } });
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    expect(handleValueInput).toHaveBeenCalledWith("Naruto");
  });

  test("disables input and applies spin class when isSearching is true", () => {
    render(<Input isSearching={true} handleValueInput={handleValueInput} />);
    const inputElement = screen.getByPlaceholderText("Find an anime...");
    const searchIcon = screen.getByTestId("search-icon");
    expect(inputElement).toBeDisabled();

    expect(inputElement).toHaveClass("searching");

    expect(searchIcon).toHaveClass("spin");
  });
});
