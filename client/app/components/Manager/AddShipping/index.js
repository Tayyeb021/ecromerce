/**
 *
 * AddShipping
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';

const AddShipping = props => {
  const {
    shippingFormData,
    formErrors,
    shippingChange,
    addShippingOption,
    isEdit = false,
    shippingOptionId
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    if (isEdit && shippingOptionId) {
      addShippingOption(shippingOptionId);
    } else {
      addShippingOption();
    }
  };

  return (
    <div className='add-shipping'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12' md='6'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={'Shipping Option Name'}
              name={'name'}
              placeholder={'e.g., Standard Shipping'}
              value={shippingFormData.name}
              onInputChange={(name, value) => {
                shippingChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <Input
              type={'number'}
              error={formErrors['cost']}
              label={'Shipping Cost (PKR)'}
              name={'cost'}
              placeholder={'0.00'}
              value={shippingFormData.cost}
              decimals={true}
              onInputChange={(name, value) => {
                shippingChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={'Description'}
              name={'description'}
              placeholder={'Shipping option description'}
              value={shippingFormData.description}
              onInputChange={(name, value) => {
                shippingChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <Input
              type={'text'}
              error={formErrors['deliveryTime']}
              label={'Delivery Time'}
              name={'deliveryTime'}
              placeholder={'e.g., 5-7 business days'}
              value={shippingFormData.deliveryTime}
              onInputChange={(name, value) => {
                shippingChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <Input
              type={'number'}
              error={formErrors['freeShippingThreshold']}
              label={'Free Shipping Threshold (PKR)'}
              name={'freeShippingThreshold'}
              placeholder={'Leave empty if not applicable'}
              value={shippingFormData.freeShippingThreshold || ''}
              decimals={true}
              onInputChange={(name, value) => {
                shippingChange(name, value || null);
              }}
            />
            <small className='form-text text-muted'>
              Orders above this amount will get free shipping. Leave empty if this option doesn't support free shipping.
            </small>
          </Col>
          <Col xs='12' md='6'>
            <Input
              type={'number'}
              error={formErrors['sortOrder']}
              label={'Sort Order'}
              name={'sortOrder'}
              placeholder={'0'}
              value={shippingFormData.sortOrder}
              decimals={false}
              onInputChange={(name, value) => {
                shippingChange(name, parseInt(value) || 0);
              }}
            />
            <small className='form-text text-muted'>
              Lower numbers appear first in the list.
            </small>
          </Col>
          <Col xs='12' md='6' className='my-2'>
            <Switch
              id={'default-shipping'}
              name={'isDefault'}
              label={'Set as Default?'}
              checked={shippingFormData.isDefault}
              toggleCheckboxChange={value => shippingChange('isDefault', value)}
            />
          </Col>
          <Col xs='12' md='6' className='my-2'>
            <Switch
              id={'active-shipping'}
              name={'isActive'}
              label={'Active?'}
              checked={shippingFormData.isActive}
              toggleCheckboxChange={value => shippingChange('isActive', value)}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-shipping-actions'>
          <Button type='submit' text={isEdit ? 'Update Shipping Option' : 'Add Shipping Option'} />
        </div>
      </form>
    </div>
  );
};

export default AddShipping;
