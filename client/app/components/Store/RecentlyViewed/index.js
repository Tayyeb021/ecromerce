/**
 *
 * Recently Viewed Products Component
 *
 */

import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ProductList from '../ProductList';

const RecentlyViewed = ({ authenticated, updateWishlist, cartItems }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        const products = JSON.parse(stored);
        setRecentProducts(products.slice(0, 8)); // Show max 8 products
      } catch (e) {
        console.error('Error parsing recently viewed products:', e);
      }
    }
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <section className='recently-viewed-section'>
      <Container>
        <div className='section-header'>
          <h2 className='section-title'>Recently Viewed</h2>
          <p className='section-subtitle'>Products you've recently browsed</p>
        </div>
        <div className='recently-viewed-list'>
          <ProductList
            products={recentProducts}
            authenticated={authenticated}
            updateWishlist={updateWishlist}
            cartItems={cartItems || []}
          />
        </div>
      </Container>
    </section>
  );
};

// Utility function to add product to recently viewed
export const addToRecentlyViewed = (product) => {
  try {
    const stored = localStorage.getItem('recentlyViewed');
    let products = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists
    products = products.filter(p => p._id !== product._id);
    
    // Add to beginning
    products.unshift({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      brand: product.brand
    });
    
    // Keep only last 20 products
    products = products.slice(0, 20);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(products));
  } catch (e) {
    console.error('Error saving recently viewed product:', e);
  }
};

const mapStateToProps = state => ({
  cartItems: state.cart.cartItems
});

export default connect(mapStateToProps)(RecentlyViewed);
