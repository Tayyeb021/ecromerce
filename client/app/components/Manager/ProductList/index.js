/**
 *
 * ProductList - Admin inline actions with multi-select bulk delete
 *
 */

import React, { useState } from 'react';
import { getImageUrl } from '../../../utils/image';

const ProductList = ({ products, onDelete, onActivate, history }) => {
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(null);

  const toggleSelect = id => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(prev =>
      prev.length === products.length ? [] : products.map(p => p._id)
    );
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
    setSelected(prev => prev.filter(x => x !== id));
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} product(s)?`)) return;
    for (const id of selected) {
      await onDelete(id);
    }
    setSelected([]);
  };

  const allSelected = products.length > 0 && selected.length === products.length;
  const someSelected = selected.length > 0;

  return (
    <div className='admin-list-wrap'>
      {someSelected && (
        <div className='admin-bulk-bar'>
          <span className='bulk-count'>{selected.length} selected</span>
          <button
            className='btn btn-sm btn-danger'
            onClick={handleBulkDelete}
          >
            <i className='fa fa-trash mr-1' /> Delete Selected
          </button>
          <button
            className='btn btn-sm btn-outline-secondary'
            onClick={() => setSelected([])}
          >
            Clear
          </button>
        </div>
      )}

      <table className='admin-table'>
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <input
                type='checkbox'
                checked={allSelected}
                onChange={toggleAll}
              />
            </th>
            <th style={{ width: 56 }}>Image</th>
            <th>Name</th>
            <th style={{ width: 90 }}>Status</th>
            <th style={{ width: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr
              key={i}
              className={selected.includes(product._id) ? 'row-selected' : ''}
            >
              <td>
                <input
                  type='checkbox'
                  checked={selected.includes(product._id)}
                  onChange={() => toggleSelect(product._id)}
                />
              </td>
              <td>
                <img
                  src={getImageUrl(product?.imageUrl)}
                  alt={product.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 6
                  }}
                />
              </td>
              <td>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{product.name}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 240
                  }}
                >
                  {product.description}
                </div>
              </td>
              <td>
                <button
                  className={`btn btn-xs ${product.isActive ? 'btn-success' : 'btn-outline-secondary'}`}
                  style={{ fontSize: 11, padding: '2px 8px' }}
                  onClick={() => onActivate && onActivate(product._id, !product.isActive)}
                  title={product.isActive ? 'Deactivate' : 'Activate'}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td>
                <div className='d-flex' style={{ gap: 6 }}>
                  <button
                    className='btn btn-sm btn-outline-primary'
                    style={{ padding: '3px 10px', fontSize: 12 }}
                    onClick={() =>
                      history && history.push(`/dashboard/product/edit/${product._id}`)
                    }
                    title='Edit'
                  >
                    <i className='fa fa-pencil' />
                  </button>
                  <button
                    className='btn btn-sm btn-outline-danger'
                    style={{ padding: '3px 10px', fontSize: 12 }}
                    onClick={() => handleDelete(product._id)}
                    disabled={deleting === product._id}
                    title='Delete'
                  >
                    {deleting === product._id ? (
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

export default ProductList;
