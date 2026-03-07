/**
 *
 * About Us Page
 *
 */

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';

const About = () => {
  return (
    <div className='about-page'>
      <Breadcrumb />
      <Container>
        <Row>
          <Col xs='12'>
            <div className='page-content'>
              <h1 className='page-title'>About A-Z On-Buz</h1>
              <div className='page-body'>
                <section className='content-section'>
                  <h2>Welcome to A-Z On-Buz</h2>
                  <p>
                    A-Z On-Buz is your one-stop destination for quality products across all categories. 
                    We are committed to providing exceptional shopping experiences with a wide selection 
                    of products, competitive prices, and outstanding customer service.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Our Mission</h2>
                  <p>
                    Our mission is to make online shopping convenient, enjoyable, and accessible to everyone. 
                    We strive to offer the best products at competitive prices while maintaining the highest 
                    standards of customer satisfaction.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>What We Offer</h2>
                  <ul>
                    <li>Wide selection of products across multiple categories</li>
                    <li>Competitive pricing and special offers</li>
                    <li>Fast and reliable shipping</li>
                    <li>Secure payment options</li>
                    <li>24/7 customer support</li>
                    <li>Easy returns and refunds</li>
                  </ul>
                </section>

                <section className='content-section'>
                  <h2>Why Choose Us</h2>
                  <p>
                    At A-Z On-Buz, we believe in building lasting relationships with our customers. 
                    We are dedicated to providing quality products, excellent service, and a seamless 
                    shopping experience. Your satisfaction is our top priority.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Contact Us</h2>
                  <p>
                    Have questions or need assistance? Feel free to reach out to us through our 
                    <a href='/contact'> contact page</a> or call us at +92 313 0417345.
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

export default About;
