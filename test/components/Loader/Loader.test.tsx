import React from "react";
import { render, screen } from "@testing-library/react";
import Loader from "../../../src/components/Loader/Loader";

jest.mock("lottie-react", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ animationData, ...props }) => (
    <div data-testid="lottie-animation" {...props} />
  ),
}));

describe("Loader component", () => {
  test("renders nothing when isLoading is false", () => {
    render(<Loader isLoading={false} />);
    const loaderElement = screen.queryByTestId("lottie-animation");
    expect(loaderElement).not.toBeInTheDocument();
  });

  test("renders loader animation when isLoading is true", () => {
    render(<Loader isLoading={true} />);
    const loaderElement = screen.getByTestId("lottie-animation");
    expect(loaderElement).toBeInTheDocument();
  });
});
