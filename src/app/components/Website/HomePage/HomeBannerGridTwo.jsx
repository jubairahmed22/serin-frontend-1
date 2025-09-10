"use client"

import React, { useState, useEffect } from 'react';

const HomeBannerGridTwo = () => {
    const [bannerData, setBannerData] = useState({ products: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                const response = await fetch('https://cosmetics-server-001.vercel.app/api/admin/bannerTwo');
                if (!response.ok) {
                    throw new Error('Failed to fetch banner data');
                }
                const data = await response.json();
                setBannerData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBannerData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;

    const handleImageClick = (categoryId) => {
        // Navigate to the product category page
        window.location.href = `/category/${categoryId}`;
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 py-8">
            <div className="gridImageBanner">
                {bannerData.products.map((product) => (
                    <div 
                        key={product._id} 
                        className="overflow-hidden rounded cursor-pointer transition-transform duration-300 "
                        onClick={() => handleImageClick(product.categoryId)}
                    >
                        <img
                            src={product.singleImage}
                            alt={product.title || "Banner image"}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeBannerGridTwo;