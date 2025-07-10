"use client";

import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="p-2 border rounded w-full cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {value ? options.find(opt => opt.value === value)?.label : "All Categories"}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border rounded bg-white shadow-lg max-h-56 overflow-y-auto">
          <div
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelect('')}
          >
            Categories
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${
                value === option.value ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}