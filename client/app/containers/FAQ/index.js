/**
 *
 * FAQ Page
 *
 */

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or sign in to complete your purchase.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards, debit cards, and other secure payment methods through our payment gateway.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary depending on your location. Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout.'
    },
    {
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free shipping on orders over PKR 5,000. Check our shipping page for more details.'
    },
    {
      question: 'Can I return or exchange a product?',
      answer: 'Yes, we accept returns within 30 days of purchase. Items must be unused and in original packaging. Please see our Returns & Refunds Policy for details.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can track your order in your account dashboard or using the tracking link provided.'
    },
    {
      question: 'What if I receive a damaged or incorrect item?',
      answer: 'Please contact us immediately through our contact page or customer service. We\'ll arrange for a replacement or refund as appropriate.'
    },
    {
      question: 'How do I create an account?',
      answer: 'Click on "Sign Up" or "Register" in the top navigation, fill in your details, and verify your email address.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 24 hours of placement if it hasn\'t been shipped yet. Contact our customer service for assistance.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we ship to select countries. Check our shipping page for available destinations and shipping rates.'
    }
  ];

  return (
    <div className='faq-page'>
      <Breadcrumb />
      <Container>
        <Row>
          <Col xs='12'>
            <div className='page-content'>
              <h1 className='page-title'>Frequently Asked Questions</h1>
              <div className='page-body'>
                <p className='intro-text'>
                  Find answers to common questions about shopping with A-Z On-Buz. 
                  If you can't find what you're looking for, please <a href='/contact'>contact us</a>.
                </p>

                <div className='faq-list'>
                  {faqs.map((faq, index) => (
                    <div key={index} className='faq-item'>
                      <h3 className='faq-question'>{faq.question}</h3>
                      <p className='faq-answer'>{faq.answer}</p>
                    </div>
                  ))}
                </div>

                <div className='faq-contact'>
                  <h2>Still have questions?</h2>
                  <p>
                    Can't find the answer you're looking for? Our customer service team is here to help. 
                    <a href='/contact'> Contact us</a> and we'll respond as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FAQ;
