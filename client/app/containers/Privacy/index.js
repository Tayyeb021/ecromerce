/**
 *
 * Privacy Policy Page
 *
 */

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';

const Privacy = () => {
  return (
    <div className='privacy-page'>
      <Breadcrumb />
      <Container>
        <Row>
          <Col xs='12'>
            <div className='page-content'>
              <h1 className='page-title'>Privacy Policy</h1>
              <div className='page-body'>
                <p className='last-updated'>Last Updated: {new Date().toLocaleDateString()}</p>

                <section className='content-section'>
                  <h2>Introduction</h2>
                  <p>
                    At A-Z On-Buz, we respect your privacy and are committed to protecting your personal data. 
                    This privacy policy explains how we collect, use, and safeguard your information when you 
                    visit our website.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Information We Collect</h2>
                  <p>We collect the following types of information:</p>
                  <ul>
                    <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                    <li><strong>Payment Information:</strong> Credit card details (processed securely through payment gateways)</li>
                    <li><strong>Account Information:</strong> Username, password, order history</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                  </ul>
                </section>

                <section className='content-section'>
                  <h2>How We Use Your Information</h2>
                  <p>We use your information to:</p>
                  <ul>
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders and account</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Prevent fraud and ensure security</li>
                  </ul>
                </section>

                <section className='content-section'>
                  <h2>Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information. 
                    However, no method of transmission over the internet is 100% secure. While we 
                    strive to protect your data, we cannot guarantee absolute security.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request data portability</li>
                  </ul>
                </section>

                <section className='content-section'>
                  <h2>Cookies</h2>
                  <p>
                    We use cookies to enhance your browsing experience, analyze site traffic, and 
                    personalize content. You can control cookie preferences through your browser settings.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Contact Us</h2>
                  <p>
                    If you have questions about this privacy policy, please contact us at 
                    <a href='/contact'> our contact page</a>.
                  </p>
                </section>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Privacy;
