import { useEffect, useRef, useState } from "react";
import { searchAnime } from "./api/anime";
import "./App.css";
import Input from "./components/Input/Input";
import { Anime } from "./types/anime";
import Loader from "./components/Loader/Loader";
import Title from "./components/Title/Title";
import Slider from "./components/Slider/Slider";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [avarageScore, setAvarageScore] = useState<number>(0);
  const [avarageAccumulator, setAvarageAccumulator] = useState<number>(0);

  const [dataList, setDataList] = useState<Anime[] | []>([]);
  const [animeSelected, setAnimeSelected] = useState<Anime | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<string | null>("");

  const animeInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleSearch("");
  }, []);

  const handleSearch = async (searchTerm: string) => {
    // logic
    setIsSearching(true);
    setIsLoading(true);
    setIsLoadingMore(false);
    setCurrentPage(1);
    setAvarageAccumulator(0);

    // data
    setDataList([]);
    setMessage("");
    setSearchTerm(searchTerm);
    setAnimeSelected(null);
    try {
      const data = await searchAnime(searchTerm.trim().toLowerCase(), 1);
      if (data.data.length === 0 && searchTerm !== "") {
        setMessage(`No results found for "${searchTerm}"`);
        return;
      }

      // insert value
      setDataList(data.data);
      setTotalPages(data.total_pages);
      setAvarageScore(data.avarage_score);
      setAvarageAccumulator(data.avarage_score);
    } catch (error) {
      setMessage(
        `It's not you, it's us. It seems we have a problem on the server.`
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsSearching(false);
      }, 500);
    }
  };

  const loadMore = async () => {
  };

  const handleSelectedAnime = (item: Anime) => {
    setAnimeSelected(item);
    setTimeout(() => {
      if (animeInfoRef.current) {
        animeInfoRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <div className="container-center">
        <Title />
        <Input isSearching={isSearching} handleValueInput={handleSearch} />
      </div>
          <Slider
            slides={dataList}
            handleClickEvent={handleSelectedAnime}
            loadMore={loadMore}
            isLoadingMore={isLoadingMore}
          />
          {animeSelected ? (
            <div ref={animeInfoRef} className="anime-info">
              <h2>{animeSelected.title}</h2>
              {animeSelected.year !== 0 ? (
                <span
                  className="slider-card-year"
                  style={{ display: "block", marginBottom: "0.4rem" }}
                >
                  {animeSelected.year}
                </span>
              ) : null}
              <span
                className="slider-card-score"
                style={{ backgroundColor: animeSelected.color }}
              >
                {animeSelected.score == 0
                  ? "-"
                  : animeSelected.score.toFixed(1)}{" "}
                ★
              </span>

              <p>{animeSelected.synopsis}</p>
            </div>
          ) : null}
        </>
      ) : message !== "" ? (
        <div className="message-info">
          <h3>{message}</h3>
        </div>
      ) : null}
      <div className="container-empty"></div>
    </>
  );
}

export default App;
