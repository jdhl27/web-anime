import { useEffect, useRef, useState } from "react";
import "./App.css";
import Loader from "./components/Loader/Loader";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    handleSearch("");
  }, []);
  const handleSearch = async (searchTerm: string) => {
    // logic
    setIsSearching(true);
    setIsLoading(true);
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
