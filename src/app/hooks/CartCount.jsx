// components/CartCount.js
"use client";
import { useEffect, useState } from 'react';
import { useCart } from './useCart';

export const CartCount = () => {
  const [count, setCount] = useState(0);
  const { cartCount } = useCart();

  // This ensures we update when either the hook updates or we get a storage event
  useEffect(() => {
    setCount(cartCount);
    
    const handleStorageChange = () => {
      const newCount = JSON.parse(localStorage.getItem('booksCart') || '[]')
        .reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCount(newCount);
    };
    
    window.addEventListener('cartUpdated', handleStorageChange);
    return () => window.removeEventListener('cartUpdated', handleStorageChange);
  }, [cartCount]);

  return count > 0 ? (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  ) : null;
};