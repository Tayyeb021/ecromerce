/**
 *
 * Checkout - Easy checkout flow: primary action first, then continue shopping
 * Guest: "Proceed to Checkout" goes to /checkout page (not login/sign-in)
 *
 */

import React from 'react';

import Button from '../../Common/Button';

const Checkout = props => {
  const { authenticated, handleShopping, handleCheckout, placeOrder, isPlacingOrder } = props;

  return (
    <div className='easy-checkout'>
      <div className='checkout-actions'>
        {authenticated ? (
          <>
            <Button
              variant='primary'
              text={isPlacingOrder ? 'Placing order…' : 'Place Order'}
              onClick={() => placeOrder()}
              className='checkout-primary-btn'
              disabled={isPlacingOrder}
            />
            <p className='checkout-hint'>Review your cart above, then place your order.</p>
            <Button
              variant='secondary'
              text='Continue Shopping'
              onClick={() => handleShopping()}
            />
          </>
        ) : (
          <>
            <Button
              variant='primary'
              text='Proceed to Checkout'
              onClick={() => handleCheckout()}
              className='checkout-primary-btn'
            />
            <p className='checkout-hint'>Go to checkout page to pay as guest or sign in.</p>
            <Button
              variant='secondary'
              text='Continue Shopping'
              onClick={() => handleShopping()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
