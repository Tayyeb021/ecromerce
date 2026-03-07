/**
 *
 * Product Comparison Component
 *
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

import Button from '../../Common/Button';
import { getProductImageUrl } from '../../../utils/image';

const ProductComparison = () => {
  const [compareProducts, setCompareProducts] = useState([]);

  useEffect(() => {
    // Load comparison products from localStorage
    const stored = localStorage.getItem('compareProducts');
    if (stored) {
      try {
        const products = JSON.parse(stored);
        setCompareProducts(products);
      } catch (e) {
        console.error('Error parsing compare products:', e);
      }
    }
  }, []);

  const removeProduct = (productId) => {
    const updated = compareProducts.filter(p => p._id !== productId);
    setCompareProducts(updated);
    localStorage.setItem('compareProducts', JSON.stringify(updated));
  };

  const clearAll = () => {
    setCompareProducts([]);
    localStorage.removeItem('compareProducts');
  };

  if (compareProducts.length === 0) {
    return (
      <section className='product-comparison-section empty'>
        <Container>
          <div className='empty-comparison'>
            <i className='fa fa-balance-scale' />
            <h3>No Products to Compare</h3>
            <p>Add products to compare by clicking the compare button on product cards</p>
            <Link to='/shop'>
              <Button variant='primary' text='Browse Products' />
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const comparisonFields = [
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price' },
    { key: 'brand', label: 'Brand' },
    { key: 'description', label: 'Description' },
    { key: 'inventory', label: 'Availability' }
  ];

  return (
    <section className='product-comparison-section'>
      <Container>
        <div className='comparison-header'>
          <h2 className='section-title'>Product Comparison</h2>
          <Button variant='secondary' text='Clear All' onClick={clearAll} />
        </div>

        <div className='comparison-table-wrapper'>
          <Table responsive className='comparison-table'>
            <thead>
              <tr>
                <th>Features</th>
                {compareProducts.map((product, index) => (
                  <th key={index} className='product-column'>
                    <button className='remove-product' onClick={() => removeProduct(product._id)}>
                      <i className='fa fa-times' />
                    </button>
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={(() => {
                          const imageUrl = getProductImageUrl(product);
                          return Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
                        })()}
                        alt={product.name}
                      />
                      <h4>{product.name}</h4>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field, fieldIndex) => (
                <tr key={fieldIndex}>
                  <td className='field-label'>{field.label}</td>
                  {compareProducts.map((product, productIndex) => (
                    <td key={productIndex}>
                      {field.key === 'brand' ? (
                        product.brand?.name || 'N/A'
                      ) : field.key === 'inventory' ? (
                        product.inventory > 0 ? (
                          <span className='in-stock-badge'>In Stock</span>
                        ) : (
                          <span className='out-of-stock-badge'>Out of Stock</span>
                        )
                      ) : field.key === 'price' ? (
                        `PKR ${product[field.key]}`
                      ) : field.key === 'description' ? (
                        <p className='description-text'>{product[field.key]?.substring(0, 100)}...</p>
                      ) : (
                        product[field.key] || 'N/A'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </section>
  );
};

// Utility function to add product to comparison
export const addToComparison = (product) => {
  try {
    const stored = localStorage.getItem('compareProducts');
    let products = stored ? JSON.parse(stored) : [];

    // Check if already exists
    if (products.find(p => p._id === product._id)) {
      return false; // Already in comparison
    }

    // Max 4 products for comparison
    if (products.length >= 4) {
      products.shift(); // Remove oldest
    }

    products.push({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      brand: product.brand,
      description: product.description,
      inventory: product.inventory || product.quantity || 0
    });

    localStorage.setItem('compareProducts', JSON.stringify(products));
    return true;
  } catch (e) {
    console.error('Error saving compare product:', e);
    return false;
  }
};

export default ProductComparison;
