/**
 *
 * Product Image Gallery with Zoom
 *
 */

import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';

const ProductImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ensure we have at least one image
  const imageList = images && images.length > 0 ? images : ['/images/placeholder-image.png'];

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className='product-image-gallery'>
      <div className='main-image-container'>
        <div 
          className={`main-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={handleImageClick}
        >
          <img
            src={imageList[selectedImage]}
            alt={productName || 'Product'}
            className='main-image'
            style={isZoomed ? {
              transform: `scale(2)`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            } : {}}
          />
          {isZoomed && (
            <div className='zoom-indicator'>
              <i className='fa fa-search-plus' />
              <span>Click to view full size</span>
            </div>
          )}
        </div>
      </div>

      {imageList.length > 1 && (
        <div className='thumbnail-list'>
          {imageList.map((image, index) => (
            <div
              key={index}
              className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`${productName} ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Modal */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className='image-modal' size='lg'>
        <ModalBody>
          <div className='modal-image-container'>
            <button className='close-modal' onClick={() => setIsModalOpen(false)}>
              <i className='fa fa-times' />
            </button>
            <img src={imageList[selectedImage]} alt={productName || 'Product'} className='modal-image' />
            {imageList.length > 1 && (
              <>
                <button 
                  className='nav-button prev' 
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : imageList.length - 1))}
                >
                  <i className='fa fa-chevron-left' />
                </button>
                <button 
                  className='nav-button next'
                  onClick={() => setSelectedImage((prev) => (prev < imageList.length - 1 ? prev + 1 : 0))}
                >
                  <i className='fa fa-chevron-right' />
                </button>
              </>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ProductImageGallery;
