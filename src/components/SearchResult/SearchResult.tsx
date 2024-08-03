import { SearchResultsProps } from "../../types/searchResult";
import Input from "../Input/Input";
import Loader from "../Loader/Loader";
import Slider from "../Slider/Slider";
import Title from "../Title/Title";
import "./SearchResult.css";

const SearchResults = ({
  isLoading,
  isLoadingMore,
  isSearching,
  dataList,
  avarageScore,
  searchTerm,
  message,
  animeSelected,
  animeInfoRef,
  handleSearch,
  loadMore,
  handleSelectedAnime,
}: SearchResultsProps) => {
  const renderDataContent = () => {
    if (dataList.length > 0) {
      return (
        <>
          {searchTerm.length > 1 && (
            <div className="container-all-table">
              <p>info: as the slider moves, the data may increase</p>
              <table className="result-table">
                <tbody>
                  <tr>
                    <td>Average score of the result:</td>
                    <td className="average-score-total">
                      {avarageScore === 0 ? "-" : avarageScore?.toFixed(1)} ★
                    </td>
                  </tr>
                  <tr>
                    <td>Total results:</td>
                    <td className="result-total">{dataList.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <Slider
            slides={dataList}
            handleClickEvent={handleSelectedAnime}
            loadMore={loadMore}
            isLoadingMore={isLoadingMore}
          />
          {animeSelected && (
            <div ref={animeInfoRef} className="anime-info">
              <h2>{animeSelected.title}</h2>
              {animeSelected.year !== 0 && (
                <span
                  className="slider-card-year"
                  style={{ display: "block", marginBottom: "0.4rem" }}
                >
                  {animeSelected.year}
                </span>
              )}
              <span
                className="slider-card-score"
                style={{ backgroundColor: animeSelected.color }}
              >
                {animeSelected.score === 0
                  ? "-"
                  : animeSelected.score.toFixed(1)}{" "}
                ★
              </span>
              <p>{animeSelected.synopsis}</p>
            </div>
          )}
        </>
      );
    } else if (message !== "") {
      return (
        <div className="message-info">
          <h3>{message}</h3>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <div data-testid="container-center" className="container-center">
        <Title />
        <Input isSearching={isSearching} handleValueInput={handleSearch} />
      </div>
      {renderDataContent()}
      <div className="container-empty"></div>
    </>
  );
};

export default SearchResults;
