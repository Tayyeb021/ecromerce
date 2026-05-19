/**
 *
 * UserList - Admin inline activate/deactivate + details
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/date';
import UserRole from '../UserRole';

const roleColors = {
  'ROLE ADMIN':    { bg: '#fef3c7', text: '#92400e' },
  'ROLE MERCHANT': { bg: '#dbeafe', text: '#1e40af' },
  'ROLE MEMBER':   { bg: '#f1f5f9', text: '#334155' }
};

const UserList = ({ users, onActivate }) => {
  return (
    <div className='admin-list-wrap'>
      <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Provider</th>
            <th>Joined</th>
            <th style={{ width: 90 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const isActive = user.isActive !== false;
            const rColors = roleColors[user.role] || roleColors['ROLE MEMBER'];
            return (
              <tr key={i} style={{ opacity: isActive ? 1 : 0.6 }}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {user.firstName
                      ? `${user.firstName} ${user.lastName || ''}`
                      : 'N/A'}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 12, color: '#475569' }}>
                    {user.email || '—'}
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      background: rColors.bg,
                      color: rColors.text,
                      padding: '2px 8px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  >
                    {user.role?.replace('ROLE ', '') || 'Member'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {user.provider || 'email'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {formatDate(user.created)}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-xs ${isActive ? 'btn-success' : 'btn-outline-danger'}`}
                    style={{ fontSize: 11, padding: '2px 8px' }}
                    onClick={() =>
                      onActivate && user._id && onActivate(user._id, !isActive)
                    }
                    title={isActive ? 'Deactivate user' : 'Activate user'}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
