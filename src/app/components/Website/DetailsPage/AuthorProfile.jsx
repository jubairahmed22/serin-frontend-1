import React, { useState, useEffect } from 'react';
import axios from 'axios'; // or use fetch API
import "../../../../styles/productDetails.css";

const AuthorProfile = ({ product }) => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dataId = product.author.id;

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://books-server-001.vercel.app/api/web/all-author/${dataId}`);
        setAuthor(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch author data');
      } finally {
        setLoading(false);
      }
    };

    if (dataId) {
      fetchAuthorData();
    }
  }, [dataId]);

  if (loading) return <div>Loading author data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!author) return <div>No author data found</div>;

  return (
    <div className="author-profile">
      <div className='flex flex-row items-center gap-5'>
        <img 
        src={author.singleImage} 
        alt={author.title} 
        style={{ width: '100px', borderRadius: '50%' }}
      />
      <h2 className='text-author-title font-bold'>{author.title}</h2>
      </div>
      <p className='indent-8 description mt-4'>{author.description}</p>
      {/* Add more author details as needed */}
    </div>
  );
};

export default AuthorProfile;