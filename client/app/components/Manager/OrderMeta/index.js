/**
 *
 * OrderMeta
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { CART_ITEM_STATUS } from '../../../constants';
import { formatDate } from '../../../utils/date';
import Button from '../../Common/Button';
import { ArrowBackIcon } from '../../Common/Icon';

const pickStr = (...vals) => {
  for (let i = 0; i < vals.length; i += 1) {
    const v = vals[i];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
};

const OrderMeta = props => {
  const { order, cancelOrder, onBack } = props;

  if (!order || !order._id) return null;

  const user = order.user && typeof order.user === 'object' ? order.user : null;
  const c = order.customer && typeof order.customer === 'object' ? order.customer : null;

  // API sends order.customer (merged guest + cart + user); fallback to guest* and profile
  const guestEmail = pickStr(c?.email, order.guestEmail, order.email);
  const guestFirstName = pickStr(c?.firstName, order.guestFirstName, order.firstName);
  const guestLastName = pickStr(c?.lastName, order.guestLastName, order.lastName);
  const guestAddress = pickStr(c?.address, order.guestAddress, order.address);
  const guestPhone = pickStr(c?.phone, order.guestPhone, order.phone, order.phoneNumber);
  const shippingOption = order.shippingOption ?? order.shipping;

  const fullNameFromParts = [guestFirstName, guestLastName].filter(Boolean).join(' ');
  const displayName = pickStr(
    c?.fullName,
    fullNameFromParts,
    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : '',
    user?.firstName,
    user?.lastName
  );

  const firstName = guestFirstName || user?.firstName || '';
  const lastName = guestLastName || user?.lastName || '';
  const email = guestEmail || user?.email || '';
  const address = guestAddress || '';
  const phone = guestPhone || user?.phoneNumber || user?.phone || '';

  const products = Array.isArray(order.products) ? order.products : [];

  const renderMetaAction = () => {
    const isNotDelivered =
      products.filter(i => i.status === CART_ITEM_STATUS.Delivered)
        .length < 1;

    if (isNotDelivered) {
      return <Button size='sm' text='Cancel Order' onClick={cancelOrder} />;
    }
  };

  return (
    <div className='order-meta'>
      <div className='d-flex align-items-center justify-content-between mb-3 title'>
        <h2 className='mb-0'>Order Details</h2>
        <Button
          variant='link'
          icon={<ArrowBackIcon />}
          size='sm'
          text='Back to orders'
          onClick={onBack}
        ></Button>
      </div>

      <Row>
        <Col xs='12' md='8'>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Order ID</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${order._id}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Order Date</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${formatDate(
                order.created
              )}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Customer Name</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>
                {displayName || '—'}
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Email</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{email || '—'}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Phone</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{phone || '—'}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Address</p>
            </Col>
            <Col xs='8'>
              <span className='order-label'>{address || '—'}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Shipping</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>
                {shippingOption?.name
                  ? `${shippingOption.name}${shippingOption.deliveryTime ? ` (${shippingOption.deliveryTime})` : ''}`
                  : '—'}
              </span>
            </Col>
          </Row>
        </Col>
        <Col xs='12' md='4' className='text-left text-md-right'>
          {renderMetaAction()}
        </Col>
      </Row>
    </div>
  );
};

export default OrderMeta;
