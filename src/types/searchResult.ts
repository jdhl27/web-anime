import { Anime } from "./anime";

export interface SearchResultsProps {
  isLoading: boolean;
  isLoadingMore: boolean;
  isSearching: boolean;
  dataList: Anime[];
  avarageScore: number;
  searchTerm: string;
  message: string | null;
  animeSelected: Anime | null;
  animeInfoRef: React.RefObject<HTMLDivElement>;
  handleSearch: (searchTerm: string) => void;
  loadMore: () => void;
  handleSelectedAnime: (item: Anime) => void;
}
