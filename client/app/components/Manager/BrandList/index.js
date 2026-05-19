/**
 *
 * BrandList - Admin inline actions
 *
 */

import React, { useState } from 'react';

const BrandList = ({ brands, user, onDelete, onActivate, history }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async id => {
    if (!window.confirm('Delete this brand?')) return;
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
  };

  return (
    <div className='admin-list-wrap'>
      <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Merchant</th>
            <th style={{ width: 90 }}>Status</th>
            <th style={{ width: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, i) => (
            <tr key={i}>
              <td>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{brand.name}</div>
              </td>
              <td>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 200
                  }}
                >
                  {brand.description || '—'}
                </div>
              </td>
              <td>
                {brand?.merchant && brand?.merchant?._id !== user?.merchant ? (
                  <span style={{ fontSize: 12, color: '#2962ff' }}>
                    {brand.merchant.name}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>
                )}
              </td>
              <td>
                <button
                  className={`btn btn-xs ${brand.isActive !== false ? 'btn-success' : 'btn-outline-secondary'}`}
                  style={{ fontSize: 11, padding: '2px 8px' }}
                  onClick={() =>
                    onActivate && onActivate(brand._id, !(brand.isActive !== false))
                  }
                >
                  {brand.isActive !== false ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td>
                <div className='d-flex' style={{ gap: 6 }}>
                  <button
                    className='btn btn-sm btn-outline-primary'
                    style={{ padding: '3px 10px', fontSize: 12 }}
                    onClick={() =>
                      history && history.push(`/dashboard/brand/edit/${brand._id}`)
                    }
                    title='Edit'
                  >
                    <i className='fa fa-pencil' />
                  </button>
                  <button
                    className='btn btn-sm btn-outline-danger'
                    style={{ padding: '3px 10px', fontSize: 12 }}
                    onClick={() => handleDelete(brand._id)}
                    disabled={deleting === brand._id}
                    title='Delete'
                  >
                    {deleting === brand._id ? (
                      <i className='fa fa-spinner fa-spin' />
                    ) : (
                      <i className='fa fa-trash' />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandList;
