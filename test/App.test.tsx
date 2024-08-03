import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/";
import { searchAnime } from "../src/api/anime";
import App from "../src/App";
import { mockAnimes } from "./__mocks__/anime";

// Mock de la función searchAnime
jest.mock("../src/api/anime", () => ({
  searchAnime: jest.fn(),
}));

const mockedSearchAnime = searchAnime as jest.MockedFunction<
  typeof searchAnime
>;

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the loader initially", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByTestId("container-center")).toBeInTheDocument();
  });

  test("renders Title and Input components", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByAltText("logo-anime")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Find an anime...")).toBeInTheDocument();
  });

  test("displays search results when searchAnime is called", async () => {
    mockedSearchAnime.mockResolvedValue({
      data: mockAnimes,
      total_pages: 1,
      avarage_score: 8.3,
    });

    await act(async () => {
      render(<App />);
    });

    const input = screen.getByPlaceholderText("Find an anime...");

    fireEvent.change(input, {
      target: { value: "Naruto" },
    });

    fireEvent.keyDown(input, {
      key: "Enter",
      code: "Enter",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Rurouni Kenshin: Meiji Kenkaku Romantan")
      ).toBeInTheDocument();
      expect(screen.getByText("TV")).toBeInTheDocument();
      expect(screen.getByText(1996)).toBeInTheDocument();
      expect(
        screen.getByText("Great, this is one of the best anime.")
      ).toBeInTheDocument();
    });
  });

  test("displays no results message when searchAnime returns empty data", async () => {
    mockedSearchAnime.mockResolvedValue({
      data: [],
      total_pages: 1,
      avarage_score: 0,
    });

    await act(async () => {
      render(<App />);
    });

    const input = screen.getByPlaceholderText("Find an anime...");

    await act(async () => {
      fireEvent.change(input, {
        target: { value: "anything" },
      });
      fireEvent.keyDown(input, {
        key: "Enter",
        code: "Enter",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText('No results found for "anything"')
      ).toBeInTheDocument();
    });
  });

  test("displays error message when searchAnime throws an error", async () => {
    mockedSearchAnime.mockRejectedValue(new Error("Server error"));

    await act(async () => {
      render(<App />);
    });

    const input = screen.getByPlaceholderText("Find an anime...");

    await act(async () => {
      fireEvent.change(input, {
        target: { value: "Naruto" },
      });
      fireEvent.keyDown(input, {
        key: "Enter",
        code: "Enter",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "It's not you, it's us. It seems we have a problem on the server."
        )
      ).toBeInTheDocument();
    });
  });
});
