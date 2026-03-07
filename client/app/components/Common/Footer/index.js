/**
 *
 * Footer
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import Newsletter from '../../../containers/Newsletter';

const Footer = () => {
  const customerServiceLinks = [
    { id: 0, name: 'Contact Us', to: '/contact' },
    { id: 1, name: 'Shipping Info', to: '/shipping' },
    { id: 2, name: 'Returns & Refunds', to: '/returns' },
    { id: 3, name: 'FAQ', to: '/faq' }
  ];

  const companyLinks = [
    { id: 0, name: 'About Us', to: '/about' },
    { id: 1, name: 'Sell With Us', to: '/sell' },
    { id: 2, name: 'Privacy Policy', to: '/privacy' },
    { id: 3, name: 'Terms & Conditions', to: '/terms' }
  ];

  const accountLinks = [
    { id: 0, name: 'My Account', to: '/dashboard' },
    { id: 1, name: 'My Orders', to: '/dashboard/orders' },
    { id: 2, name: 'Wishlist', to: '/dashboard/wishlist' },
    { id: 3, name: 'Support', to: '/support' }
  ];

  const renderLinks = (links) => (
    <ul>
      {links.map(item => (
        <li key={item.id} className='footer-link'>
          <Link to={item.to}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className='footer'>
      <Container>
        <div className='footer-content'>
          <div className='footer-block'>
            <div className='block-title'>
              <h3 className='text-uppercase'>Customer Service</h3>
            </div>
            <div className='block-content'>
              {renderLinks(customerServiceLinks)}
            </div>
          </div>
          <div className='footer-block'>
            <div className='block-title'>
              <h3 className='text-uppercase'>Company</h3>
            </div>
            <div className='block-content'>
              {renderLinks(companyLinks)}
            </div>
          </div>
          <div className='footer-block'>
            <div className='block-title'>
              <h3 className='text-uppercase'>My Account</h3>
            </div>
            <div className='block-content'>
              {renderLinks(accountLinks)}
            </div>
          </div>
          <div className='footer-block'>
            <div className='block-title'>
              <h3 className='text-uppercase'>Newsletter</h3>
              <p className='newsletter-desc'>Subscribe to get special offers and updates</p>
            </div>
            <div className='block-content'>
              <Newsletter />
            </div>
          </div>
        </div>
        <div className='footer-copyright'>
          <span>© {new Date().getFullYear()} A-Z On-Buz. All rights reserved.</span>
        </div>
        <ul className='footer-social-item'>
          <li>
            <a href='/#facebook' rel='noreferrer noopener' target='_blank' aria-label='Facebook'>
              <span className='facebook-icon' />
            </a>
          </li>
          <li>
            <a href='/#instagram' rel='noreferrer noopener' target='_blank' aria-label='Instagram'>
              <span className='instagram-icon' />
            </a>
          </li>
          <li>
            <a href='/#pinterest' rel='noreferrer noopener' target='_blank' aria-label='Pinterest'>
              <span className='pinterest-icon' />
            </a>
          </li>
          <li>
            <a href='/#twitter' rel='noreferrer noopener' target='_blank' aria-label='Twitter'>
              <span className='twitter-icon' />
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
};

export default Footer;
