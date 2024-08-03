import { useEffect, useRef, useState } from "react";
import { searchAnime } from "./api/anime";
import "./App.css";
import Loader from "./components/Loader/Loader";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [dataList, setDataList] = useState<Anime[] | []>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<string | null>("");
  useEffect(() => {
    handleSearch("");
  }, []);
  const handleSearch = async (searchTerm: string) => {
    // logic
    setIsSearching(true);
    setIsLoading(true);
    // data
    setDataList([]);
    setMessage("");
    setSearchTerm(searchTerm);
    try {
      const data = await searchAnime(searchTerm.trim().toLowerCase(), 1);
      if (data.data.length === 0 && searchTerm !== "") {
        setMessage(`No results found for "${searchTerm}"`);
        return;
      }

      // insert value
      setDataList(data.data);
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

  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <div className="container-center">
        <Title />
        <Input isSearching={isSearching} handleValueInput={handleSearch} />
      </div>
    </>
  );
}

export default App;
