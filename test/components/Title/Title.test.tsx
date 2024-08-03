import React from "react";
import { render, screen } from "@testing-library/react";
import Title from "../../../src/components/Title/Title";
import "@testing-library/jest-dom";

jest.mock("../../../src/assets/images/logo_anime.png", () => "logo_anime.png");

describe("Title component", () => {
  test("renders the logo image", () => {
    render(<Title />);
    const logoElement = screen.getByAltText("logo-anime");
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute("src", "logo_anime.png");
  });
});
