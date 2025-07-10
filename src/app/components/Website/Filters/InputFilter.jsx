import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const avroMap = {
  // Vowels (standalone)
  a: "অ",
  aa: "আ",
  i: "ই",
  ii: "ঈ",
  ee: "ঈ",
  u: "উ",
  oo: "ঊ",
  e: "এ",
  oi: "ঐ",
  o: "ও",
  ou: "ঔ",
  ri: "ঋ",

  // Consonants
  k: "ক",
  kh: "খ",
  g: "গ",
  gh: "ঘ",
  ng: "ঙ",
  c: "চ",
  ch: "ছ",
  j: "জ",
  jh: "ঝ",
  ny: "ঞ",
  t: "ত",
  th: "থ",
  d: "দ",
  dh: "ধ",
  n: "ন",
  p: "প",
  ph: "ফ",
  f: "ফ",
  b: "ব",
  bh: "ভ",
  m: "ম",
  z: "জ",
  r: "র",
  l: "ল",
  sh: "শ",
  ss: "ষ",
  s: "স",
  h: "হ",
  y: "য়",
  w: "ও",
  v: "ভ",
  x: "ক্স",

  // Numbers
  0: "০",
  1: "১",
  2: "২",
  3: "৩",
  4: "৪",
  5: "৫",
  6: "৬",
  7: "৭",
  8: "৮",
  9: "৯",
};

const vowelSigns = {
  a: "",
  aa: "া",
  i: "ি",
  ii: "ী",
  ee: "ী",
  u: "ু",
  oo: "ূ",
  e: "ে",
  oi: "ৈ",
  o: "ো",
  ou: "ৌ",
  ri: "ৃ",
};

const isConsonant = (char) => {
  return Object.keys(avroMap).includes(char) && !vowelSigns[char];
};

const transliterateToBanglaAvro = (text) => {
  let result = "";
  let buffer = "";
  let lastCharWasConsonant = false;

  const flushBuffer = () => {
    if (buffer) {
      if (vowelSigns[buffer] && lastCharWasConsonant) {
        // Vowel sign
        result += vowelSigns[buffer];
      } else if (avroMap[buffer]) {
        result += avroMap[buffer];
        lastCharWasConsonant = isConsonant(buffer);
      } else {
        result += buffer;
        lastCharWasConsonant = false;
      }
      buffer = "";
    }
  };

  for (let i = 0; i < text.length; i++) {
    buffer += text[i].toLowerCase();

    // Try 3-letter match
    if (buffer.length === 3 && (avroMap[buffer] || vowelSigns[buffer])) {
      flushBuffer();
      continue;
    }

    // Try 2-letter match
    if (buffer.length >= 2) {
      const sub = buffer.slice(-2);
      if (avroMap[sub] || vowelSigns[sub]) {
        flushBuffer();
        continue;
      }
    }

    // Try single char if buffer doesn't match next
    if (buffer.length >= 2 && !(avroMap[buffer] || vowelSigns[buffer])) {
      const oneChar = buffer[0];
      buffer = buffer.slice(1);
      if (avroMap[oneChar]) {
        result += avroMap[oneChar];
        lastCharWasConsonant = isConsonant(oneChar);
      } else {
        result += oneChar;
        lastCharWasConsonant = false;
      }
    }
  }

  flushBuffer();
  return result;
};

const InputFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [banglaSearchTerm, setBanglaSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastValidBanglaTerm, setLastValidBanglaTerm] = useState("");
  const [searchMode, setSearchMode] = useState("english"); // 'english' or 'bangla'
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setBanglaSearchTerm("");
      setShowDropdown(false);
      return;
    }

    const transliterated = transliterateToBanglaAvro(searchTerm);
    setBanglaSearchTerm(transliterated);

    const isBangla = /[\u0980-\u09FF]/.test(transliterated);
    if (isBangla) setLastValidBanglaTerm(transliterated);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // First try searching in English
        if (searchMode === "english") {
          const englishRes = await fetch(
            `https://books-server-001.vercel.app/api/admin/all-products?` +
              new URLSearchParams({
                title: searchTerm,
                searchMode: "flexible",
                limit: 10,
              })
          );
          const englishData = await englishRes.json();

          if (englishData.success && englishData.products?.length > 0) {
            setProducts(englishData.products);
            setSearchMode("english");
            setShowDropdown(true);
            setLoading(false);
            return;
          }

          // If no English results found, switch to Bangla search
          setSearchMode("bangla");
          return;
        }

        // If in Bangla mode or no English results found
        if (searchMode === "bangla" && banglaSearchTerm) {
          const banglaRes = await fetch(
            `https://books-server-001.vercel.app/api/admin/all-products?` +
              new URLSearchParams({
                title: banglaSearchTerm,
                searchMode: "flexible",
                limit: 10,
              })
          );
          const banglaData = await banglaRes.json();

          if (banglaData.success) {
            setProducts(banglaData.products || []);
            setShowDropdown(true);
          } else {
            setError(banglaData.error || "Failed to fetch");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, banglaSearchTerm, searchMode]);

  const handleProductSelect = (product) => {
    setSearchTerm(product.title);
    setBanglaSearchTerm(product.title);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && products.length > 0) {
      handleProductSelect(products[0]);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center w-full relative"
      ref={dropdownRef}
    >
      <div className="relative w-full ">
        <input
          className="w-full bg-gray-100 h-12 rounded-full px-4 focus:outline-none 
                     border border-gray-300 focus:border-blue-500 text-gray-800
                     placeholder-gray-500 text-lg"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearchMode("english"); // Reset to English search mode when typing
          }}
          onFocus={() => searchTerm && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => {
              setSearchTerm("");
              setBanglaSearchTerm("");
              setProducts([]);
              setShowDropdown(false);
              setSearchMode("english");
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-14 w-full  bg-white shadow-lg rounded-md z-50 max-h-80 overflow-y-auto border border-gray-200">
          {loading ? (
            <div className="p-4 text-center">Searching...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <Link key={product._id} href={`/all-books/${product._id}`}>
                  <li
                
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex items-center transition-colors"
                    onClick={() => handleProductSelect(product)}
                  >
                    {product?.singleImage && (
                      <div className="w-10 h-10 mr-3 flex-shrink-0">
                        <img
                          src={product.singleImage}
                          alt={product.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {product.title}
                      </div>
                      {product.category && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {product.category}
                        </div>
                      )}
                    </div>
                    {product.price && (
                      <div className="text-blue-600 font-medium whitespace-nowrap ml-2">
                        ৳{product.price.toLocaleString("bn-BD")}
                      </div>
                    )}
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-500 text-center">
              {searchMode === "english" ? (
                <div>No results found for "{searchTerm}" in English</div>
              ) : (
                <>
                  <div>
                    No results found for "{lastValidBanglaTerm}" in Bangla
                  </div>
                  <div className="text-xs mt-1">
                    Try using different keywords
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputFilter;
