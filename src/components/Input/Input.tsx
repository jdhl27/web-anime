import { useState, FC, ChangeEvent, KeyboardEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { PiKeyReturn } from "react-icons/pi";

import "./Input.css";

interface InputProps {
  isSearching?: boolean;
  handleValueInput: (value: string) => void;
}

const Input: FC<InputProps> = ({ isSearching = false, handleValueInput }) => {
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleSearch = () => {
    setIsActive(false);
    handleValueInput(inputValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container-all">
      <div
        className={`container-input ${isActive ? "active" : ""} ${
          isSearching ? "searching" : ""
        }`}
      >
        <IoSearchOutline
          className={`search-icon ${isSearching ? "spin" : ""}`}
        />
        <input
          className={isSearching ? "searching" : ""}
          placeholder="Find an anime..."
          value={inputValue}
          onChange={handleChange}
          type="text"
          name=""
          id=""
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isSearching}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={`text-info ${isActive ? "fade-in" : "fade-out"}`}>
        Press Enter <PiKeyReturn /> to search
      </div>
    </div>
  );
};

export default Input;
