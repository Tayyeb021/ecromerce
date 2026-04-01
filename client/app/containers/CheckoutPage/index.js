/*
 *
 * CheckoutPage - Single checkout page: cart summary, shipping, guest or sign-in
 *
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';

import actions from '../../actions';
import CartList from '../../components/Store/CartList';
import CartSummary from '../../components/Store/CartSummary';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
const CheckoutPage = (props) => {
  const {
    cartItems,
    cartTotal,
    authenticated,
    shippingOptions,
    selectedShippingOption,
    fetchShippingOptions,
    setSelectedShippingOption,
    placeOrder,
    placeGuestOrder,
    isPlacingOrder,
    toggleCart
  } = props;

  const history = useHistory();
  const [guestEmail, setGuestEmail] = useState('');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestErrors, setGuestErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0) {
      history.replace('/shop');
      return;
    }
    if (shippingOptions.length === 0) {
      fetchShippingOptions();
    }
  }, [cartItems.length, history, shippingOptions.length, fetchShippingOptions]);

  const validateCheckoutForm = () => {
    const email = (guestEmail || '').trim();
    const address = (guestAddress || '').trim();
    const phone = (guestPhone || '').trim();
    const errors = {};
    if (!email) {
      errors.email = ['Email is required.'];
    } else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) errors.email = ['Enter a valid email.'];
    }
    if (!address) errors.address = ['Address is required.'];
    if (!phone) errors.phone = ['Phone number is required.'];
    return { errors, email, address, phone };
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    const { errors, email, address, phone } = validateCheckoutForm();
    if (Object.keys(errors).length > 0) {
      setGuestErrors(errors);
      return;
    }
    setGuestErrors({});
    placeGuestOrder({
      email,
      firstName: guestFirstName.trim() || undefined,
      lastName: guestLastName.trim() || undefined,
      address,
      phone
    });
  };

  const handleLoggedInSubmit = (e) => {
    e.preventDefault();
    const { errors, email, address, phone } = validateCheckoutForm();
    if (Object.keys(errors).length > 0) {
      setGuestErrors(errors);
      return;
    }
    setGuestErrors({});
    placeOrder({
      email,
      firstName: guestFirstName.trim() || undefined,
      lastName: guestLastName.trim() || undefined,
      address,
      phone
    });
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className='checkout-page'>
      <Container>
        <p className='mb-1'><Link to='/shop' className='redirect-link'>Shop</Link> / Checkout</p>
        <h1 className='checkout-page-title'>Checkout</h1>

        <Row>
          <Col md='7' className='mb-4'>
            <div className='checkout-cart-section'>
              <h2 className='section-title'>Your cart</h2>
              <CartList
                cartItems={cartItems}
                handleRemoveFromCart={props.handleRemoveFromCart}
                toggleCart={toggleCart}
              />
            </div>
          </Col>
          <Col md='5'>
            <div className='checkout-summary-section'>
              <CartSummary
                cartTotal={cartTotal}
                shippingOptions={shippingOptions}
                selectedShippingOption={selectedShippingOption}
                fetchShippingOptions={fetchShippingOptions}
                setSelectedShippingOption={setSelectedShippingOption}
              />

              {authenticated ? (
                <div className='checkout-section mt-3'>
                  <h3 className='section-subtitle'>Shipping & contact information</h3>
                  <p className='text-muted small'>Email, address and phone are required for delivery.</p>
                  <form onSubmit={handleLoggedInSubmit} noValidate>
                    <Input
                      type='text'
                      label='Email'
                      name='checkoutEmail'
                      placeholder='your@email.com'
                      value={guestEmail}
                      error={guestErrors.email}
                      onInputChange={(name, value) => {
                        setGuestEmail(value);
                        if (guestErrors.email) setGuestErrors({ ...guestErrors, email: null });
                      }}
                    />
                    <Input
                      type='text'
                      label='First name (optional)'
                      name='checkoutFirstName'
                      placeholder='First name'
                      value={guestFirstName}
                      onInputChange={(name, value) => setGuestFirstName(value)}
                    />
                    <Input
                      type='text'
                      label='Last name (optional)'
                      name='checkoutLastName'
                      placeholder='Last name'
                      value={guestLastName}
                      onInputChange={(name, value) => setGuestLastName(value)}
                    />
                    <Input
                      type='text'
                      label='Address'
                      name='checkoutAddress'
                      placeholder='Delivery address'
                      value={guestAddress}
                      error={guestErrors.address}
                      onInputChange={(name, value) => {
                        setGuestAddress(value);
                        if (guestErrors.address) setGuestErrors({ ...guestErrors, address: null });
                      }}
                    />
                    <Input
                      type='text'
                      label='Phone number'
                      name='checkoutPhone'
                      placeholder='Phone number'
                      value={guestPhone}
                      error={guestErrors.phone}
                      onInputChange={(name, value) => {
                        setGuestPhone(value);
                        if (guestErrors.phone) setGuestErrors({ ...guestErrors, phone: null });
                      }}
                    />
                    <Button
                      type='submit'
                      variant='primary'
                      text={isPlacingOrder ? 'Placing order…' : 'Place Order'}
                      disabled={isPlacingOrder}
                      className='w-100 mt-2'
                    />
                  </form>
                </div>
              ) : (
                <div className='checkout-guest-section mt-3'>
                  <h3 className='section-subtitle'>Check out as guest</h3>
                  <p className='text-muted small'>Email, address and phone are required. We’ll send the order confirmation to your email.</p>
                  <form onSubmit={handleGuestSubmit} noValidate>
                    <Input
                      type='text'
                      label='Email'
                      name='guestEmail'
                      placeholder='your@email.com'
                      value={guestEmail}
                      error={guestErrors.email}
                      onInputChange={(name, value) => {
                        setGuestEmail(value);
                        if (guestErrors.email) setGuestErrors({ ...guestErrors, email: null });
                      }}
                    />
                    <Input
                      type='text'
                      label='First name (optional)'
                      name='guestFirstName'
                      placeholder='First name'
                      value={guestFirstName}
                      onInputChange={(name, value) => setGuestFirstName(value)}
                    />
                    <Input
                      type='text'
                      label='Last name (optional)'
                      name='guestLastName'
                      placeholder='Last name'
                      value={guestLastName}
                      onInputChange={(name, value) => setGuestLastName(value)}
                    />
                    <Input
                      type='text'
                      label='Address'
                      name='guestAddress'
                      placeholder='Delivery address'
                      value={guestAddress}
                      error={guestErrors.address}
                      onInputChange={(name, value) => {
                        setGuestAddress(value);
                        if (guestErrors.address) setGuestErrors({ ...guestErrors, address: null });
                      }}
                    />
                    <Input
                      type='text'
                      label='Phone number'
                      name='guestPhone'
                      placeholder='Phone number'
                      value={guestPhone}
                      error={guestErrors.phone}
                      onInputChange={(name, value) => {
                        setGuestPhone(value);
                        if (guestErrors.phone) setGuestErrors({ ...guestErrors, phone: null });
                      }}
                    />
                    <Button
                      type='submit'
                      variant='primary'
                      text={isPlacingOrder ? 'Placing order…' : 'Place order (no account)'}
                      disabled={isPlacingOrder}
                      className='w-100 mt-2'
                    />
                  </form>
                  <div className='checkout-divider my-3'>
                    <span>or</span>
                  </div>
                  <div className='checkout-signin-links'>
                    <Link to='/login' className='btn btn-outline-primary btn-block mb-2'>
                      Sign in to place order
                    </Link>
                    <Link to='/register' className='btn btn-outline-secondary btn-block'>
                      Create an account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <div className='mt-3'>
          <Link to='/shop' className='redirect-link'>← Continue shopping</Link>
        </div>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart.cartItems,
  cartTotal: state.cart.cartTotal,
  authenticated: state.authentication.authenticated,
  shippingOptions: state.cart.shippingOptions,
  selectedShippingOption: state.cart.selectedShippingOption,
  isPlacingOrder: state.order.isPlacingOrder
});

export default connect(mapStateToProps, actions)(CheckoutPage);
