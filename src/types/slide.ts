import { Anime } from "./anime";

export interface Slide extends Anime {
  clickEvent: () => void;
}
