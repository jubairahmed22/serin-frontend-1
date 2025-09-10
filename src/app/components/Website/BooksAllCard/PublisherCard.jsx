import React from 'react';
import { useRouter } from 'next/navigation';

const PublisherCard = ({ product }) => {
    const router = useRouter();

    const handleAuthorClick = () => {
        const params = new URLSearchParams();
        params.set('publisher', product._id); // Assuming 'title' is the author's name
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div 
            className='mb-10 cursor-pointer flex flex-col justify-center items-center' 
            onClick={handleAuthorClick}
        >
            <img 
                className='w-[150px] h-[150px] rounded-2xl object-cover' 
                src={product.singleImage} 
                alt={product.title}
            />
            <h1 className='authorTitle bangla-text text-black font-semibold mt-3'>
                {product.title}
            </h1>
        </div>
    );
};

export default PublisherCard;