/**
 *
 * EditBanner
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';
import SelectOption from '../../Common/SelectOption';

const EditBanner = props => {
  const {
    categories,
    bannerFormEditData,
    formEditErrors,
    bannerEditChange,
    updateBanner,
    bannerId
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    updateBanner(bannerId);
  };

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  const selectedCategory = categoryOptions.find(
    cat => cat.value === bannerFormEditData.category
  );

  return (
    <div className='edit-banner'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formEditErrors['title']}
              label={'Title'}
              name={'title'}
              placeholder={'Banner Title (Optional)'}
              value={bannerFormEditData.title}
              onInputChange={(name, value) => {
                bannerEditChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'file'}
              error={formEditErrors['image']}
              label={'Upload New Image'}
              name={'image'}
              placeholder={'Choose image file'}
              onInputChange={(name, value) => {
                bannerEditChange(name, value);
                // Create preview URL
                if (value) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    bannerEditChange('imagePreview', reader.result);
                  };
                  reader.readAsDataURL(value);
                }
              }}
            />
            <small className='text-muted d-block mb-2'>
              Upload a new image file to replace the current one (JPG, PNG, GIF)
            </small>
            {bannerFormEditData.imagePreview && (
              <div className='image-preview mb-3'>
                <img 
                  src={bannerFormEditData.imagePreview} 
                  alt='New Preview' 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid #FF6B35' }}
                />
                <small className='text-success d-block mt-1'>New image preview</small>
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
              error={formEditErrors['imageUrl']}
              label={'Image URL (Alternative)'}
              name={'imageUrl'}
              placeholder={'https://example.com/image.jpg'}
              value={bannerFormEditData.imageUrl}
              onInputChange={(name, value) => {
                bannerEditChange(name, value);
              }}
            />
            <small className='text-muted'>
              Enter a new image URL if not uploading a file
            </small>
            {bannerFormEditData.imageUrl && !bannerFormEditData.image && (
              <div className='image-preview mb-3 mt-2'>
                <img 
                  src={bannerFormEditData.imageUrl} 
                  alt='Current Preview' 
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
              error={formEditErrors['link']}
              label={'Link URL (Optional)'}
              name={'link'}
              placeholder={'https://example.com/page'}
              value={bannerFormEditData.link}
              onInputChange={(name, value) => {
                bannerEditChange(name, value);
              }}
            />
            <small className='text-muted'>
              URL to redirect when banner is clicked
            </small>
          </Col>
          <Col xs='12'>
            <Input
              type={'textarea'}
              error={formEditErrors['content']}
              label={'Content (Optional)'}
              name={'content'}
              placeholder={'Banner content or description'}
              rows={4}
              value={bannerFormEditData.content}
              onInputChange={(name, value) => {
                bannerEditChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <SelectOption
              error={formEditErrors['category']}
              label={'Category (Optional)'}
              value={selectedCategory}
              options={categoryOptions}
              handleSelectChange={value => {
                bannerEditChange('category', value ? value.value : '');
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <Input
              type={'number'}
              error={formEditErrors['order']}
              label={'Display Order'}
              name={'order'}
              placeholder={'0'}
              value={bannerFormEditData.order}
              onInputChange={(name, value) => {
                bannerEditChange(name, parseInt(value) || 0);
              }}
            />
            <small className='text-muted'>
              Lower numbers appear first
            </small>
          </Col>
          <Col xs='12' className='my-2'>
            <Switch
              id={'active-banner-edit'}
              name={'isActive'}
              label={'Active?'}
              checked={bannerFormEditData.isActive}
              toggleCheckboxChange={value => bannerEditChange('isActive', value)}
            />
          </Col>
        </Row>
        <hr />
        <div className='edit-banner-actions'>
          <Button type='submit' text='Update Banner' variant='primary' />
        </div>
      </form>
    </div>
  );
};

export default EditBanner;
