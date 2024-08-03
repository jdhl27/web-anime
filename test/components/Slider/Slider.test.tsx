import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Slider from "../../../src/components/Slider/Slider";
import "@testing-library/jest-dom"; // para utilizar los matchers de jest-dom
import { mockAnimes } from "../../__mocks__/anime";

describe("Slider component", () => {
  test("renders slides correctly", () => {
    render(
      <Slider
        slides={mockAnimes}
        handleClickEvent={jest.fn()}
        loadMore={jest.fn()}
        isLoadingMore={false}
      />
    );

    mockAnimes.forEach((slide) => {
      expect(screen.getByText(slide.title)).toBeInTheDocument();
      if (slide.type) {
        expect(screen.getByText(slide.type)).toBeInTheDocument();
      }
      expect(
        screen.getByText(`${slide.score.toFixed(1)} ★`)
      ).toBeInTheDocument();
      expect(screen.getByText(slide.recommendation)).toBeInTheDocument();
      if (slide.year !== 0) {
        expect(screen.getByText(`${slide.year}`)).toBeInTheDocument();
      }
      if (slide.trailerUrl) {
        expect(screen.getByTestId(`trailer-${slide.malId}`)).toHaveAttribute(
          "href",
          slide.trailerUrl
        );
      } else {
        expect(
          screen.getByTestId(`trailer-not-available-${slide.malId}`)
        ).toBeInTheDocument();
      }
    });
  });

  test("calls handleClickEvent when a slide is clicked", () => {
    const handleClickEvent = jest.fn();
    render(
      <Slider
        slides={mockAnimes}
        handleClickEvent={handleClickEvent}
        loadMore={jest.fn()}
        isLoadingMore={false}
      />
    );

    fireEvent.click(screen.getByText(mockAnimes[0].title));
    expect(handleClickEvent).toHaveBeenCalledWith(mockAnimes[0]);
  });

  test("calls loadMore when scrolling to the end", () => {
    const loadMore = jest.fn();
    render(
      <Slider
        slides={mockAnimes}
        handleClickEvent={jest.fn()}
        loadMore={loadMore}
        isLoadingMore={false}
      />
    );

    const slider = screen.getByTestId("slider");
    fireEvent.scroll(slider, { target: { scrollLeft: 1000 } });
    expect(loadMore).toHaveBeenCalled();
  });

  test("renders loading skeletons when isLoadingMore is true", () => {
    render(
      <Slider
        slides={mockAnimes}
        handleClickEvent={jest.fn()}
        loadMore={jest.fn()}
        isLoadingMore={true}
      />
    );

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  test("slideLeft and slideRight functions work correctly", () => {
    render(
      <Slider
        slides={mockAnimes}
        handleClickEvent={jest.fn()}
        loadMore={jest.fn()}
        isLoadingMore={false}
      />
    );

    const slider = screen.getByTestId("slider");

    // Mock scrollLeft and scrollWidth properties
    Object.defineProperty(slider, "scrollLeft", {
      value: 0,
      writable: true,
    });

    Object.defineProperty(slider, "scrollWidth", {
      value: 2000,
    });

    Object.defineProperty(slider, "clientWidth", {
      value: 500,
    });

    fireEvent.click(screen.getByTestId("right-arrow"));
    expect(slider.scrollLeft).toBe(0);

    fireEvent.click(screen.getByTestId("left-arrow"));
    expect(slider.scrollLeft).toBe(0);
  });

  test("calls slideLeft when left chevron is clicked", () => {
    render(
      <Slider
        slides={mockAnimes}
        handleClickEvent={jest.fn()}
        loadMore={jest.fn()}
        isLoadingMore={false}
      />
    );

    const sliderElement = screen.getByTestId("slider") as HTMLDivElement;
    const leftArrow = screen.getByTestId("left-arrow");

    fireEvent.click(leftArrow);

    expect(sliderElement.scrollLeft).toBeLessThan(500);
  });

  test("calls slideRight when right chevron is clicked", () => {
    render(
      <Slider
        slides={mockAnimes}
        handleClickEvent={jest.fn()}
        loadMore={jest.fn()}
        isLoadingMore={false}
      />
    );

    const sliderElement = screen.getByTestId("slider") as HTMLDivElement;
    const rightArrow = screen.getByTestId("right-arrow");

    fireEvent.click(rightArrow);

    expect(sliderElement.scrollLeft).toBeLessThan(500);
  });
});
