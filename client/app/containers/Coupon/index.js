/**
 *
 * Coupon - Admin management
 *
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { success, error as notifyError } from 'react-notification-system-redux';
import { API_URL } from '../../constants';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class Coupon extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      isLoading: true,
      showForm: false,
      form: {
        code: '',
        type: 'percentage',
        value: '',
        minOrderAmount: '',
        maxDiscount: '',
        usageLimit: '',
        expiryDate: '',
        isActive: true
      }
    };
  }

  async componentDidMount() {
    await this.loadCoupons();
  }

  loadCoupons = async () => {
    try {
      this.setState({ isLoading: true });
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/coupon`, {
        headers: { Authorization: token }
      });
      this.setState({ coupons: res.data.coupons || [] });
    } catch (e) {
      console.error('Failed to load coupons', e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleFormChange = (field, value) => {
    this.setState(prev => ({ form: { ...prev.form, [field]: value } }));
  };

  handleCreate = async () => {
    const { form } = this.state;
    if (!form.code || !form.value) return;
    try {
      const token = localStorage.getItem('token');
      const payload = {
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiryDate: form.expiryDate || null,
        isActive: form.isActive
      };
      await axios.post(`${API_URL}/coupon/add`, payload, {
        headers: { Authorization: token }
      });
      this.props.dispatch(success({ title: 'Coupon created!', position: 'tr', autoDismiss: 3 }));
      this.setState({
        showForm: false,
        form: { code: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiryDate: '', isActive: true }
      });
      await this.loadCoupons();
    } catch (e) {
      const msg = e.response?.data?.error || 'Could not create coupon.';
      this.props.dispatch(notifyError({ title: msg, position: 'tr', autoDismiss: 4 }));
    }
  };

  handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/coupon/${id}`, { headers: { Authorization: token } });
      this.props.dispatch(success({ title: 'Coupon deleted.', position: 'tr', autoDismiss: 2 }));
      await this.loadCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  handleToggle = async (id, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/coupon/${id}/activate`, { isActive }, { headers: { Authorization: token } });
      await this.loadCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { coupons, isLoading, showForm, form } = this.state;

    return (
      <div className='coupon-dashboard'>
        <SubPage
          title='Coupon Codes'
          actionTitle='Add Coupon'
          handleAction={() => this.setState(prev => ({ showForm: !prev.showForm }))}
        >
          {showForm && (
            <div className='coupon-form-card'>
              <h5 className='mb-3'>New Coupon</h5>
              <div className='row'>
                <div className='col-12 col-md-6 mb-2'>
                  <label>Code *</label>
                  <input
                    className='form-control'
                    placeholder='e.g. SAVE10'
                    value={form.code}
                    onChange={e => this.handleFormChange('code', e.target.value.toUpperCase())}
                  />
                </div>
                <div className='col-12 col-md-3 mb-2'>
                  <label>Type *</label>
                  <select
                    className='form-control'
                    value={form.type}
                    onChange={e => this.handleFormChange('type', e.target.value)}
                  >
                    <option value='percentage'>Percentage (%)</option>
                    <option value='fixed'>Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div className='col-12 col-md-3 mb-2'>
                  <label>{form.type === 'percentage' ? 'Discount %' : 'Discount PKR'} *</label>
                  <input
                    className='form-control'
                    type='number'
                    min='1'
                    placeholder={form.type === 'percentage' ? '10' : '100'}
                    value={form.value}
                    onChange={e => this.handleFormChange('value', e.target.value)}
                  />
                </div>
                <div className='col-12 col-md-3 mb-2'>
                  <label>Min Order (PKR)</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    placeholder='0'
                    value={form.minOrderAmount}
                    onChange={e => this.handleFormChange('minOrderAmount', e.target.value)}
                  />
                </div>
                {form.type === 'percentage' && (
                  <div className='col-12 col-md-3 mb-2'>
                    <label>Max Discount (PKR)</label>
                    <input
                      className='form-control'
                      type='number'
                      min='0'
                      placeholder='No cap'
                      value={form.maxDiscount}
                      onChange={e => this.handleFormChange('maxDiscount', e.target.value)}
                    />
                  </div>
                )}
                <div className='col-12 col-md-3 mb-2'>
                  <label>Usage Limit</label>
                  <input
                    className='form-control'
                    type='number'
                    min='1'
                    placeholder='Unlimited'
                    value={form.usageLimit}
                    onChange={e => this.handleFormChange('usageLimit', e.target.value)}
                  />
                </div>
                <div className='col-12 col-md-3 mb-2'>
                  <label>Expiry Date</label>
                  <input
                    className='form-control'
                    type='date'
                    value={form.expiryDate}
                    onChange={e => this.handleFormChange('expiryDate', e.target.value)}
                  />
                </div>
              </div>
              <div className='mt-3 d-flex' style={{ gap: 10 }}>
                <button className='btn btn-primary' onClick={this.handleCreate}>
                  Create Coupon
                </button>
                <button className='btn btn-outline-secondary' onClick={() => this.setState({ showForm: false })}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <LoadingIndicator inline />
          ) : coupons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              No coupons yet. Click "Add Coupon" to create one.
            </div>
          ) : (
            <div className='admin-list-wrap mt-3'>
              <table className='admin-table'>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Used</th>
                    <th>Expiry</th>
                    <th style={{ width: 90 }}>Status</th>
                    <th style={{ width: 70 }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14, background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
                          {c.code}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {c.type === 'percentage'
                          ? `${c.value}%${c.maxDiscount ? ` (max PKR ${c.maxDiscount})` : ''}`
                          : `PKR ${c.value}`}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {c.minOrderAmount > 0 ? `PKR ${c.minOrderAmount}` : '—'}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}
                      </td>
                      <td style={{ fontSize: 12, color: '#64748b' }}>
                        {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <button
                          className={`btn btn-xs ${c.isActive ? 'btn-success' : 'btn-outline-secondary'}`}
                          style={{ fontSize: 11, padding: '2px 8px' }}
                          onClick={() => this.handleToggle(c._id, !c.isActive)}
                        >
                          {c.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <button
                          className='btn btn-sm btn-outline-danger'
                          style={{ padding: '3px 10px', fontSize: 12 }}
                          onClick={() => this.handleDelete(c._id)}
                        >
                          <i className='fa fa-trash' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = () => ({});
export default connect(mapStateToProps)(Coupon);
