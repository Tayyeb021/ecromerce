/**
 *
 * SocialShare
 *
 */

import React from 'react';

import {
  EmailShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton
} from 'react-share';
import { WhatsAppIcon } from '../../Common/Icon';

const SocialShare = props => {
  const { product } = props;

  const shareMsg = `I ♥ ${
    product.name
  } product on A-Z On-Buz!  Here's the link, ${
    window.location.protocol !== 'https' ? 'http' : 'https'
  }://${window.location.host}/product/${product.slug}`;

  return (
    <ul className='d-flex flex-row mx-0 mb-0 justify-content-center justify-content-md-start share-box'>
      <li>
        <FacebookShareButton url={`${shareMsg}`} className='share-btn facebook'>
          <i className='fa fa-facebook'></i>
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton url={`${shareMsg}`} className='share-btn twitter'>
          <i className='fa fa-twitter'></i>
        </TwitterShareButton>
      </li>
      <li>
        <EmailShareButton url={`${shareMsg}`} className='share-btn envelope'>
          <i className='fa fa-envelope-o'></i>
        </EmailShareButton>
      </li>
      <li>
        <WhatsappShareButton url={`${shareMsg}`} className='share-btn whatsapp'>
          <WhatsAppIcon width='20' height='20' />
        </WhatsappShareButton>
      </li>
    </ul>
  );
};

export default SocialShare;
