// SearchResult.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/";
import { SearchResultsProps } from "../../../src/types/searchResult";
import SearchResults from "../../../src/components/SearchResult/SearchResult";
import { mockAnimes } from "../../__mocks__/anime";

const mockLoadMore = jest.fn();
const mockHandleSelectedAnime = jest.fn();
const mockHandleSearch = jest.fn();

const defaultProps: SearchResultsProps = {
  isLoading: false,
  isLoadingMore: false,
  isSearching: false,
  dataList: [],
  avarageScore: 0,
  searchTerm: "",
  message: "",
  animeSelected: null,
  animeInfoRef: React.createRef<HTMLDivElement>(),
  handleSearch: mockHandleSearch,
  loadMore: mockLoadMore,
  handleSelectedAnime: mockHandleSelectedAnime,
};

describe("SearchResults Component", () => {
  test("renders component", () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByTestId("container-center")).toBeInTheDocument();
  });

  test("renders input and title", () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByAltText("logo-anime")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Find an anime...")).toBeInTheDocument();
  });

  test("renders results when dataList is not empty and there is a search", () => {
    render(
      <SearchResults
        {...defaultProps}
        dataList={mockAnimes}
        searchTerm={"naruto"}
      />
    );
    expect(
      screen.getByText("Average score of the result:")
    ).toBeInTheDocument();
  });

  test("renders message when there is a message", () => {
    render(<SearchResults {...defaultProps} message="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  test("displays search results when searchAnime is called", async () => {
    render(
      <SearchResults
        {...defaultProps}
        dataList={mockAnimes}
        searchTerm="Rurouni"
      />
    );

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
    render(
      <SearchResults
        {...defaultProps}
        searchTerm="anything"
        message={'No results found for "anything"'}
      />
    );

    expect(
      screen.getByText('No results found for "anything"')
    ).toBeInTheDocument();
  });

  test("handles anime selection", () => {
    render(<SearchResults {...defaultProps} dataList={mockAnimes} />);
    const animeTitle = screen.getByText(".hack//Sign");
    fireEvent.click(animeTitle);
    expect(mockHandleSelectedAnime).toHaveBeenCalledWith(mockAnimes[1]);
  });

  test("Do not show average when there is no search", () => {
    render(<SearchResults {...defaultProps} dataList={mockAnimes} />);

    expect(
      screen.queryByText("info: as the slider moves, the data may increase")
    ).not.toBeInTheDocument();
  });
});
