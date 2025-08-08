import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
const Footer = () => (
  <footer className="footer mt-5 py-4 bg-dark text-white">
    <Container>
      <Row>
        <Col md={6}>
          <h5>MechObject</h5>
          <p>Your trusted partner for mechanical equipment and solutions.</p>
        </Col>
        <Col md={6} className="text-md-end">
          <h5>Quick Links</h5>
          <ul className="list-unstyled">
            <li><Link to="/about" className="text-white">About Us</Link></li>
            <li><Link to="/contact" className="text-white">Contact</Link></li>
            <li><Link to="/products" className="text-white">Products</Link></li>
          </ul>
        </Col>
      </Row>
      <hr style={{ borderColor: '#007bff' }} />
      <p className="text-center">&copy; 2025 MechObject. All rights reserved.</p>
    </Container>
  </footer>
);

export default Footer;
