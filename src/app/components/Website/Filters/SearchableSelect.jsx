"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronDown, FiX, FiCheck, FiSearch } from "react-icons/fi";

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  loading = false,
  disabled = false,
  noOptionsMessage = "No options available",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef([]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            Math.min(prev + 1, filteredOptions.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(filteredOptions[highlightedIndex]._id);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, highlightedIndex, filteredOptions]
  );

  const handleSelect = (selectedValue) => {
    onChange({ target: { value: selectedValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange({ target: { value: "" } });
  setSearchTerm("");
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const displayValue = value
    ? options.find((opt) => opt._id === value)?.title
    : placeholder;

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <button
        type="button"
        className={`flex items-center justify-between w-full px-4 py-3 text-left transition-all duration-200 rounded-lg ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "bg-white border border-emerald-300 hover:border-emerald-500 text-gray-700 cursor-pointer"
        } ${
          isOpen
            ? "ring-2 ring-emerald-500 border-emerald-500 shadow-md"
            : "shadow-sm"
        }`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${!value ? "text-black" : ""}`}>
          {displayValue}
        </span>
        <div className="flex items-center space-x-2 ml-2">
          {value && !disabled && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-gray-400  hover:text-emerald-600 transition-colors p-1 rounded-full hover:bg-emerald-50"
              aria-label="Clear selection"
            >
              <FiX size={16} />
            </button>
          )}
          <FiChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-xl dark:bg-gray-800 max-h-72 overflow-auto border border-emerald-200 dark:border-emerald-800"
          role="listbox"
        >
          {/* Search input */}
          <div className="sticky top-0 p-3 bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-emerald-900">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-100 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                aria-autocomplete="list"
                aria-controls="searchable-select-options"
              />
            </div>
          </div>

          {/* Options list */}
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {noOptionsMessage}
            </div>
          ) : (
            <ul
              id="searchable-select-options"
              className="py-1 space-y-1"
              role="listbox"
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={option._id}
                  ref={(el) => (optionsRef.current[index] = el)}
                  className={`px-4 py-2 mx-2 rounded-md cursor-pointer flex items-center justify-between transition-colors ${
                    highlightedIndex === index
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100"
                      : "hover:bg-emerald-50 dark:hover:bg-emerald-800/50"
                  } ${
                    value === option._id
                      ? "bg-emerald-50 dark:bg-emerald-800/30 font-medium text-emerald-800 dark:text-emerald-200"
                      : ""
                  }`}
                  onClick={() => handleSelect(option._id)}
                  role="option"
                  aria-selected={value === option._id}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="truncate">{option.title}</span>
                  {value === option._id && (
                    <FiCheck className="text-emerald-600 dark:text-emerald-400 ml-2 flex-shrink-0" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;