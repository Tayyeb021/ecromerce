/**
 *
 * Terms & Conditions Page
 *
 */

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';

const Terms = () => {
  return (
    <div className='terms-page'>
      <Breadcrumb />
      <Container>
        <Row>
          <Col xs='12'>
            <div className='page-content'>
              <h1 className='page-title'>Terms & Conditions</h1>
              <div className='page-body'>
                <p className='last-updated'>Last Updated: {new Date().toLocaleDateString()}</p>

                <section className='content-section'>
                  <h2>Acceptance of Terms</h2>
                  <p>
                    By accessing and using A-Z On-Buz, you accept and agree to be bound by these 
                    Terms & Conditions. If you do not agree, please do not use our website.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Use of Website</h2>
                  <p>You agree to use our website only for lawful purposes and in accordance with these terms. 
                  You must not:</p>
                  <ul>
                    <li>Use the website in any way that violates applicable laws</li>
                    <li>Attempt to gain unauthorized access to any part of the website</li>
                    <li>Transmit any malicious code or harmful content</li>
                    <li>Interfere with the website's operation or security</li>
                  </ul>
                </section>

                <section className='content-section'>
                  <h2>Product Information</h2>
                  <p>
                    We strive to provide accurate product information, but we do not warrant that product 
                    descriptions, prices, or other content is accurate, complete, or error-free. Product 
                    images are for illustrative purposes and may not reflect the exact appearance.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Pricing and Payment</h2>
                  <p>
                    All prices are displayed in the currency specified and are subject to change without notice. 
                    We reserve the right to correct pricing errors. Payment must be made at the time of order 
                    placement through our secure payment gateway.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Shipping and Delivery</h2>
                  <p>
                    Shipping costs and delivery times are provided at checkout. We are not responsible for 
                    delays caused by shipping carriers or customs. Risk of loss passes to you upon delivery 
                    to the carrier.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Returns and Refunds</h2>
                  <p>
                    Please refer to our <a href='/returns'>Returns & Refunds Policy</a> for detailed 
                    information about returning products and requesting refunds.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Intellectual Property</h2>
                  <p>
                    All content on this website, including text, graphics, logos, and images, is the property 
                    of A-Z On-Buz and is protected by copyright and trademark laws.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by law, A-Z On-Buz shall not be liable for any indirect, 
                    incidental, or consequential damages arising from your use of the website or products.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective 
                    immediately upon posting. Your continued use of the website constitutes acceptance 
                    of the modified terms.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Contact Us</h2>
                  <p>
                    For questions about these terms, please contact us through 
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

export default Terms;
