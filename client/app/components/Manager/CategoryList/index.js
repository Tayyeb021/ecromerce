/**
 *
 * CategoryList - Admin inline actions
 *
 */

import React, { useState } from 'react';

const CategoryList = ({ categories, onDelete, onActivate, history }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async id => {
    if (!window.confirm('Delete this category?')) return;
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
            <th style={{ width: 90 }}>Status</th>
            <th style={{ width: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, i) => (
            <tr key={i}>
              <td>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {category.icon && (
                    <i className={`fa ${category.icon} mr-1`} style={{ color: '#2962ff' }} />
                  )}
                  {category.name}
                </div>
              </td>
              <td>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 220
                  }}
                >
                  {category.description || '—'}
                </div>
              </td>
              <td>
                <button
                  className={`btn btn-xs ${category.isActive !== false ? 'btn-success' : 'btn-outline-secondary'}`}
                  style={{ fontSize: 11, padding: '2px 8px' }}
                  onClick={() =>
                    onActivate && onActivate(category._id, !(category.isActive !== false))
                  }
                >
                  {category.isActive !== false ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td>
                <div className='d-flex' style={{ gap: 6 }}>
                  <button
                    className='btn btn-sm btn-outline-primary'
                    style={{ padding: '3px 10px', fontSize: 12 }}
                    onClick={() =>
                      history && history.push(`/dashboard/category/edit/${category._id}`)
                    }
                    title='Edit'
                  >
                    <i className='fa fa-pencil' />
                  </button>
                  <button
                    className='btn btn-sm btn-outline-danger'
                    style={{ padding: '3px 10px', fontSize: 12 }}
                    onClick={() => handleDelete(category._id)}
                    disabled={deleting === category._id}
                    title='Delete'
                  >
                    {deleting === category._id ? (
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

export default CategoryList;
