/**
 *
 * Returns & Refunds Policy Page
 *
 */

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';

const Returns = () => {
  return (
    <div className='returns-page'>
      <Breadcrumb />
      <Container>
        <Row>
          <Col xs='12'>
            <div className='page-content'>
              <h1 className='page-title'>Returns & Refunds Policy</h1>
              <div className='page-body'>
                <p className='last-updated'>Last Updated: {new Date().toLocaleDateString()}</p>

                <section className='content-section'>
                  <h2>Return Policy</h2>
                  <p>
                    We want you to be completely satisfied with your purchase. If you're not happy with 
                    your order, you can return it within 30 days of delivery for a full refund or exchange.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Eligibility for Returns</h2>
                  <p>To be eligible for a return, items must:</p>
                  <ul>
                    <li>Be unused and in original condition</li>
                    <li>Be in original packaging with tags attached</li>
                    <li>Include proof of purchase (order number or receipt)</li>
                    <li>Not be personalized or custom-made items</li>
                    <li>Not be perishable goods or items that cannot be resold</li>
                  </ul>
                </section>

                <section className='content-section'>
                  <h2>How to Return an Item</h2>
                  <ol>
                    <li>Log into your account and go to "My Orders"</li>
                    <li>Select the order containing the item you want to return</li>
                    <li>Click "Return Item" and follow the instructions</li>
                    <li>Print the return label and attach it to your package</li>
                    <li>Ship the item back to us using the provided return label</li>
                  </ol>
                </section>

                <section className='content-section'>
                  <h2>Return Shipping</h2>
                  <p>
                    Return shipping costs are the responsibility of the customer unless the item is defective 
                    or incorrect. We'll provide a prepaid return label for defective or incorrect items.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Refund Process</h2>
                  <p>
                    Once we receive your returned item, we'll inspect it and process your refund within 
                    5-7 business days. Refunds will be issued to the original payment method. You'll 
                    receive an email confirmation once the refund is processed.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Exchanges</h2>
                  <p>
                    If you need to exchange an item for a different size or color, please return the 
                    original item and place a new order for the desired item. This ensures faster 
                    processing and delivery.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Damaged or Defective Items</h2>
                  <p>
                    If you receive a damaged or defective item, please contact us immediately. We'll 
                    arrange for a replacement or full refund, including return shipping costs.
                  </p>
                </section>

                <section className='content-section'>
                  <h2>Non-Returnable Items</h2>
                  <p>The following items cannot be returned:</p>
                  <ul>
                    <li>Personalized or custom-made products</li>
                    <li>Perishable goods</li>
                    <li>Intimate or sanitary goods</li>
                    <li>Items damaged by misuse or normal wear</li>
                  </ul>
                </section>

                <section className='content-section'>
                  <h2>Questions?</h2>
                  <p>
                    If you have questions about returns or refunds, please 
                    <a href='/contact'> contact our customer service team</a>. We're here to help!
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

export default Returns;
