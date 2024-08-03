import React, { useRef, useEffect } from "react";
import "./Slider.css";
import { MdChevronLeft, MdChevronRight, MdReviews } from "react-icons/md";
import { Anime } from "../../types/anime";

interface SliderProps {
  slides?: Anime[] | [];
  handleClickEvent: (value: Anime) => void;
  loadMore: () => void;
  isLoadingMore: boolean;
}

const Slider: React.FC<SliderProps> = ({
  slides = [],
  handleClickEvent,
  loadMore,
  isLoadingMore,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 500;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 500;
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => {
        slider.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMore]);

  return (
    <div id="main-slider-container">
      <MdChevronLeft
        size={40}
        className="slider-icon left"
        onClick={slideLeft}
        data-testid="left-arrow"
      />
      <div id="slider" ref={sliderRef} data-testid="slider">
        {slides.map((slide) => (
          <div
            className="slider-card"
            key={slide.malId}
            onClick={() => handleClickEvent(slide)}
            data-testid={`slide-${slide.malId}`}
          >
            <div
              className="slider-card-image"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: "cover",
              }}
            ></div>
            <div className="slider-card-content">
              <h3 className="slider-card-title">{slide.title}</h3>
              <p className="slider-card-type">{slide.type}</p>
              <div className="slider-card-info">
                <span
                  className="slider-card-score"
                  style={{ backgroundColor: slide.color }}
                >
                  {slide.score == 0 ? "-" : slide.score.toFixed(1)} ★
                </span>
                {slide.year !== 0 ? (
                  <span className="slider-card-year">{slide.year}</span>
                ) : null}
              </div>
              <span className="slider-card-recommendation">
                <MdReviews />
                {slide.recommendation}
              </span>
              {slide.trailerUrl ? (
                <a
                  href={slide.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="slider-card-trailer"
                  data-testid={`trailer-${slide.malId}`}
                >
                  watch trailer
                </a>
              ) : (
                <div
                  className="slider-card-trailer not-available"
                  data-testid={`trailer-not-available-${slide.malId}`}
                >
                  trailer not available
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoadingMore && (
          <div
            data-testid="loading-skeleton"
            className="slider-card slider-loading-skeleton"
          >
            <div className="slider-card-image skeleton"></div>
            <div className="slider-card-content">
              <h3 className="slider-card-title skeleton"></h3>
              <p className="slider-card-type skeleton"></p>
              <div className="slider-card-info">
                <span className="slider-card-score skeleton"></span>
                <span className="slider-card-year skeleton"></span>
              </div>
              <span className="slider-card-recommendation skeleton"></span>
              <div className="slider-card-trailer not-available skeleton"></div>
            </div>
          </div>
        )}
      </div>
      <MdChevronRight
        size={40}
        className="slider-icon right"
        onClick={slideRight}
        data-testid="right-arrow"
      />
    </div>
  );
};

export default Slider;
