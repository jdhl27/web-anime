import { useEffect, useRef, useState } from "react";
import { searchAnime } from "./api/anime";
import { Anime } from "./types/anime";
import SearchResults from "./components/SearchResult/SearchResult";

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
    if (isLoadingMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const data = await searchAnime(searchTerm.trim().toLowerCase(), nextPage);
      // save data
      setDataList((prevList) => [...prevList, ...data.data]);

      // save current page
      setCurrentPage(nextPage);

      // avarage accumulator
      const sum = avarageAccumulator + data.avarage_score;
      setAvarageAccumulator(sum);

      setAvarageScore(sum / nextPage);
    } catch (error) {
      setMessage(
        `It's not you, it's us. It seems we have a problem on the server.`
      );
    } finally {
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 1000);
    }
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
    <SearchResults
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      isSearching={isSearching}
      dataList={dataList}
      avarageScore={avarageScore}
      searchTerm={searchTerm}
      message={message}
      animeSelected={animeSelected}
      animeInfoRef={animeInfoRef}
      handleSearch={handleSearch}
      loadMore={loadMore}
      handleSelectedAnime={handleSelectedAnime}
    />
  );
}

export default App;
