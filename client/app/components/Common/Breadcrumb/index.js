/**
 *
 * Breadcrumb Component
 *
 */

import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';

const Breadcrumb = ({ location, productName, categoryName }) => {
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const getBreadcrumbName = (pathname) => {
    const nameMap = {
      'shop': 'Shop',
      'product': 'Product',
      'category': 'Category',
      'brands': 'Brands',
      'contact': 'Contact Us',
      'sell': 'Sell With Us',
      'dashboard': 'Dashboard',
      'orders': 'Orders',
      'account': 'Account',
      'cart': 'Shopping Cart',
      'checkout': 'Checkout'
    };
    return nameMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  return (
    <div className='breadcrumb-wrapper'>
      <Container>
        <nav aria-label='breadcrumb' className='breadcrumb-nav'>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item'>
              <Link to='/'>
                <i className='fa fa-home' />
                <span>Home</span>
              </Link>
            </li>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const displayName = categoryName && name === 'category' 
                ? categoryName 
                : productName && name === pathnames[pathnames.length - 1]
                ? productName
                : getBreadcrumbName(name);

              return (
                <li key={name} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                  {isLast ? (
                    <span>{displayName}</span>
                  ) : (
                    <Link to={routeTo}>{displayName}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </div>
  );
};

export default withRouter(Breadcrumb);
