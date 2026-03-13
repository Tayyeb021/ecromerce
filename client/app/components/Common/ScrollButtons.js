/**
 *
 * ScrollButtons - Scroll to top and bottom buttons with WhatsApp
 *
 */

import React from 'react';
import { WhatsAppIcon } from './Icon';

class ScrollButtons extends React.PureComponent {
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  openWhatsApp = () => {
    window.open('https://wa.me/923130417345', '_blank', 'noopener,noreferrer');
  };

  render() {
    return (
      <div className='scroll-buttons'>
        <button
          className='scroll-btn scroll-btn-up'
          onClick={this.scrollToTop}
          aria-label='Scroll to top'
          title='Scroll to top'
        >
          <i className='fa fa-chevron-up' />
        </button>
        <button
          className='scroll-btn scroll-btn-whatsapp'
          onClick={this.openWhatsApp}
          aria-label='Contact us on WhatsApp'
          title='WhatsApp: +92 313 0417345'
        >
          <WhatsAppIcon width='26' height='26' />
          <span className='whatsapp-number'>+92 313 0417345</span>
        </button>
        <button
          className='scroll-btn scroll-btn-down'
          onClick={this.scrollToBottom}
          aria-label='Scroll to bottom'
          title='Scroll to bottom'
        >
          <i className='fa fa-chevron-down' />
        </button>
      </div>
    );
  }
}

export default ScrollButtons;
