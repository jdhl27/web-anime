import { useEffect, useRef, useState } from "react";
import "./App.css";
import Loader from "./components/Loader/Loader";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <Loader isLoading={isLoading} />
    </>
  );
}

export default App;
