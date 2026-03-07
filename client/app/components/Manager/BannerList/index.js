/**
 *
 * BannerList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Card, CardBody, Badge } from 'reactstrap';

const BannerList = props => {
  const { banners, deleteBanner } = props;

  const handleDelete = (e, bannerId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteBanner(bannerId);
    }
  };

  return (
    <div className='banner-list'>
      <div className='row'>
        {banners.map((banner, index) => (
          <div key={banner._id || index} className='col-md-6 col-lg-4 mb-4'>
            <Card className='h-100 banner-card'>
              <div className='banner-image-wrapper'>
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title || `Banner ${index + 1}`}
                  className='banner-image'
                  onError={(e) => {
                    e.target.src = '/images/placeholder-image.png';
                  }}
                />
                <div className='banner-overlay'>
                  <Link
                    to={`/dashboard/banner/edit/${banner._id}`}
                    className='btn btn-sm btn-primary mr-2'
                  >
                    <i className='fa fa-edit' /> Edit
                  </Link>
                  <button
                    className='btn btn-sm btn-danger'
                    onClick={(e) => handleDelete(e, banner._id)}
                  >
                    <i className='fa fa-trash' /> Delete
                  </button>
                </div>
              </div>
              <CardBody>
                <div className='d-flex justify-content-between align-items-start mb-2'>
                  <h5 className='mb-0'>{banner.title || 'Untitled Banner'}</h5>
                  <Badge color={banner.isActive ? 'success' : 'secondary'}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {banner.link && (
                  <p className='mb-1'>
                    <small className='text-muted'>Link: </small>
                    <a href={banner.link} target='_blank' rel='noopener noreferrer'>
                      {banner.link}
                    </a>
                  </p>
                )}
                {banner.category && (
                  <p className='mb-1'>
                    <small className='text-muted'>Category: </small>
                    {banner.category.name}
                  </p>
                )}
                <p className='mb-0'>
                  <small className='text-muted'>Order: </small>
                  {banner.order || 0}
                </p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerList;
