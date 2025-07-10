import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

const ImageManagement = ({ product }) => {
  const bookRef = useRef();

  // Combine cover image with other images
  const allPages = [product.singleImage, ...product.images];

  return (
    <div className="book-container cursor-pointer">
      <HTMLFlipBook
        ref={bookRef}
        width={300}
        height={450}
        size="stretch"
        minWidth={200}
        maxWidth={1000}
        minHeight={300}
        maxHeight={1200}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="flip-book"
        style={{ background: 'transparent' }}
      >
        {allPages.map((img, index) => (
          <div key={index} className="page">
            <div className="page-content">
              <img src={img} alt={`Page ${index + 1}`} />
            </div>
          </div>
        ))}
      </HTMLFlipBook>

      <div className="controls">
        <button 
          className="arrow left" 
          onClick={() => bookRef.current.pageFlip().flipPrev()}
        >
          ‹
        </button>
        {/* <span className="page-counter">
          {bookRef.current?.pageFlip()?.getCurrentPageIndex() + 1 || 1} / {allPages.length}
        </span> */}
        <button 
          className="arrow right" 
          onClick={() => bookRef.current.pageFlip().flipNext()}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ImageManagement;