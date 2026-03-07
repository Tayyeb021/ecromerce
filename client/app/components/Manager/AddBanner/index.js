/**
 *
 * AddBanner
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';
import SelectOption from '../../Common/SelectOption';

const AddBanner = props => {
  const {
    categories,
    bannerFormData,
    formErrors,
    bannerChange,
    addBanner
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addBanner();
  };

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  return (
    <div className='add-banner'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['title']}
              label={'Title'}
              name={'title'}
              placeholder={'Banner Title (Optional)'}
              value={bannerFormData.title}
              onInputChange={(name, value) => {
                bannerChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'file'}
              error={formErrors['image']}
              label={'Upload Image'}
              name={'image'}
              placeholder={'Choose image file'}
              onInputChange={(name, value) => {
                bannerChange(name, value);
                // Create preview URL
                if (value) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    bannerChange('imagePreview', reader.result);
                  };
                  reader.readAsDataURL(value);
                }
              }}
            />
            <small className='text-muted d-block mb-2'>
              Upload an image file from your computer (JPG, PNG, GIF)
            </small>
            {bannerFormData.imagePreview && (
              <div className='image-preview mb-3'>
                <img 
                  src={bannerFormData.imagePreview} 
                  alt='Preview' 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid #ddd' }}
                />
              </div>
            )}
          </Col>
          <Col xs='12'>
            <div className='divider-text'>
              <span>OR</span>
            </div>
          </Col>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['imageUrl']}
              label={'Image URL (Alternative)'}
              name={'imageUrl'}
              placeholder={'https://example.com/image.jpg'}
              value={bannerFormData.imageUrl}
              onInputChange={(name, value) => {
                bannerChange(name, value);
              }}
            />
            <small className='text-muted'>
              Enter the full URL of the banner image if not uploading a file
            </small>
            {bannerFormData.imageUrl && !bannerFormData.image && (
              <div className='image-preview mb-3 mt-2'>
                <img 
                  src={bannerFormData.imageUrl} 
                  alt='Preview' 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid #ddd' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </Col>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['link']}
              label={'Link URL (Optional)'}
              name={'link'}
              placeholder={'https://example.com/page'}
              value={bannerFormData.link}
              onInputChange={(name, value) => {
                bannerChange(name, value);
              }}
            />
            <small className='text-muted'>
              URL to redirect when banner is clicked
            </small>
          </Col>
          <Col xs='12'>
            <Input
              type={'textarea'}
              error={formErrors['content']}
              label={'Content (Optional)'}
              name={'content'}
              placeholder={'Banner content or description'}
              rows={4}
              value={bannerFormData.content}
              onInputChange={(name, value) => {
                bannerChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <SelectOption
              error={formErrors['category']}
              label={'Category (Optional)'}
              value={bannerFormData.category}
              options={categoryOptions}
              handleSelectChange={value => {
                bannerChange('category', value ? value.value : '');
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <Input
              type={'number'}
              error={formErrors['order']}
              label={'Display Order'}
              name={'order'}
              placeholder={'0'}
              value={bannerFormData.order}
              onInputChange={(name, value) => {
                bannerChange(name, parseInt(value) || 0);
              }}
            />
            <small className='text-muted'>
              Lower numbers appear first
            </small>
          </Col>
          <Col xs='12' className='my-2'>
            <Switch
              id={'active-banner'}
              name={'isActive'}
              label={'Active?'}
              checked={bannerFormData.isActive}
              toggleCheckboxChange={value => bannerChange('isActive', value)}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-banner-actions'>
          <Button type='submit' text='Add Banner' variant='primary' />
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
