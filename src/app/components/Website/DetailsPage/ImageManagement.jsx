import React, { useState, useRef } from 'react';
import '../../../../styles/imageShow.css';

const ImageManagement = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const mainImageRef = useRef(null);

  const allImages = [product.singleImage, ...product.images];

  // Handle zoom movement
  const handleMouseMove = (e) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="image-gallery">
      {/* Main image with inline zoom */}
      <div
        className="main-image-container"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        ref={mainImageRef}
      >
        <img
          src={allImages[selectedImage]}
          alt={`Product view ${selectedImage + 1}`}
          className={`main-image ${zoom ? "zoomed" : ""}`}
          style={{ transformOrigin }}
        />
      </div>

      {/* Thumbnails */}
      <div className="thumbnail-section">
        <div className="thumbnails-container">
          {allImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail-wrapper ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} className="thumbnail" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageManagement;
