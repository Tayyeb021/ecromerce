/**
 *
 * ShippingList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

const ShippingList = props => {
  const { shippingOptions, deleteShippingOption } = props;

  return (
    <div className='shipping-list'>
      {shippingOptions.map((option, index) => (
        <div
          key={index}
          className='d-block mb-3 p-4 shipping-box'
        >
          <div className='d-flex align-items-center justify-content-between mb-2'>
            <div className='d-flex align-items-center'>
              <Link
                to={`/dashboard/shipping/edit/${option._id}`}
                className='text-decoration-none'
              >
                <h4 className='mb-0'>{option.name}</h4>
              </Link>
              {option.isDefault && (
                <Badge color='primary' className='ml-2'>Default</Badge>
              )}
              {!option.isActive && (
                <Badge color='secondary' className='ml-2'>Inactive</Badge>
              )}
            </div>
            <div>
              <span className='text-muted'>PKR {option.cost.toFixed(2)}</span>
            </div>
          </div>
          {option.description && (
            <p className='mb-2 text-muted'>{option.description}</p>
          )}
          <div className='d-flex flex-wrap'>
            {option.deliveryTime && (
              <span className='mr-3 text-muted'>
                <strong>Delivery:</strong> {option.deliveryTime}
              </span>
            )}
            {option.freeShippingThreshold && (
              <span className='mr-3 text-muted'>
                <strong>Free Shipping:</strong> Over PKR {option.freeShippingThreshold.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShippingList;
