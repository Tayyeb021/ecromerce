/**
 * SiteSetting — Admin-only settings page
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';

class SiteSetting extends React.PureComponent {
  componentDidMount() {
    this.props.fetchSiteSettings();
  }

  render() {
    const { formData, isLoading, siteSettingChange, saveSiteSetting } = this.props;

    return (
      <div className='site-setting'>
        <h4 className='setting-page-title'>Site Settings</h4>

        <div className='setting-section'>
          <h5 className='setting-section-title'>
            <i className='fa fa-bullhorn' /> Facebook Pixel
          </h5>
          <p className='setting-section-desc'>
            Enter your Facebook Pixel ID to enable conversion tracking (PageView, ViewContent, AddToCart, Purchase).
            Get your Pixel ID from{' '}
            <a href='https://business.facebook.com/events_manager' target='_blank' rel='noopener noreferrer'>
              Facebook Events Manager
            </a>.
          </p>

          <Row>
            <Col xs='12' md='8'>
              <div className='form-group setting-field'>
                <label className='setting-label'>Pixel ID</label>
                <div className='setting-input-row'>
                  <input
                    type='text'
                    className='form-control setting-input'
                    placeholder='e.g. 1234567890123456'
                    value={formData.pixelId || ''}
                    onChange={e => siteSettingChange('pixelId', e.target.value)}
                  />
                  <button
                    className='btn btn-primary setting-save-btn'
                    disabled={isLoading}
                    onClick={() => saveSiteSetting('pixelId')}
                  >
                    {isLoading ? 'Saving…' : 'Save'}
                  </button>
                </div>
                {formData.pixelId && (
                  <small className='setting-hint'>
                    <i className='fa fa-check-circle text-success' /> Pixel ID is set. Tracking is active.
                  </small>
                )}
                {!formData.pixelId && (
                  <small className='setting-hint text-muted'>
                    Leave blank to disable Facebook Pixel tracking.
                  </small>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formData: state.siteSetting.formData,
  isLoading: state.siteSetting.isLoading
});

export default connect(mapStateToProps, actions)(SiteSetting);
