"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const DropdownPublication = ({ setIsOpen }) => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await fetch(
          "https://books-server-001.vercel.app/api/web/all-publisher"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch popular books");
        }
        const data = await response.json();
        setPopularBooks(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  const handleAuthorClick = (author) => {
    return (e) => {
      e.preventDefault();
      const params = new URLSearchParams();
      params.set("publisher", author._id);
      router.push(`/all-books?${params.toString()}`);
      setIsOpen();
    };
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error)
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="grid grid-cols-3 gap-5"
      >
        {popularBooks.map((product, index) => (
          <motion.button
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: index * 0.05,
            }}
            onClick={handleAuthorClick(product)}
            className="cursor-pointer text-start font-medium textSubLink text-gray-800 mb-1 hover:text-green-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {product.title}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default DropdownPublication;