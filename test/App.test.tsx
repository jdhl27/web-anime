import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";
import { searchAnime } from "../src/api/anime";
import { mockAnimes } from "./__mocks__/anime";

jest.mock("../src/api/anime", () => ({
  searchAnime: jest.fn(),
}));

const mockedSearchAnime = searchAnime as jest.MockedFunction<
  typeof searchAnime
>;

describe("App component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders SearchResults component", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByPlaceholderText("Find an anime...")).toBeInTheDocument();
  });

  test("initial search on component mount", async () => {
    mockedSearchAnime.mockResolvedValueOnce({
      data: [],
      total_pages: 1,
      avarage_score: 0,
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(mockedSearchAnime).toHaveBeenCalledWith("", 1);
    });
  });

  test("displays search results when searchAnime is called", async () => {
    mockedSearchAnime.mockResolvedValueOnce({
      data: mockAnimes,
      total_pages: 1,
      avarage_score: 8.0,
    });

    render(<App />);

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
      expect(
        screen.getByText("Great, this is one of the best anime.")
      ).toBeInTheDocument();
    });
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

  test("handles anime selection", async () => {
    mockedSearchAnime.mockResolvedValueOnce({
      data: mockAnimes,
      total_pages: 1,
      avarage_score: 8.0,
    });

    render(<App />);

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
    });

    fireEvent.click(
      screen.getByText("Rurouni Kenshin: Meiji Kenkaku Romantan")
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "In the final years of the Bakumatsu era lived a legendary assassin known as Hitokiri Battousai."
        )
      ).toBeInTheDocument();
    });
  });

  test("displays message when no results found", async () => {
    mockedSearchAnime.mockResolvedValue({
      data: [],
      total_pages: 1,
      avarage_score: 3.8,
    });

    await act(async () => {
      render(<App />);
    });

    const input = screen.getByPlaceholderText("Find an anime...");

    await act(async () => {
      fireEvent.change(input, { target: { value: "Unknown Anime" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    });

    await waitFor(() => {
      const message = screen.getByText('No results found for "Unknown Anime"');
      expect(message).toBeInTheDocument();
    });
  });

  test("handles server error on search", async () => {
    mockedSearchAnime.mockRejectedValueOnce(new Error("Server error"));

    render(<App />);

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
        screen.getByText(
          `It's not you, it's us. It seems we have a problem on the server.`
        )
      ).toBeInTheDocument();
    });
  });
});
