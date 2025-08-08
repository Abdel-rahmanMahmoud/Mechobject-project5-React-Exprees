import React from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/home.css'; 

// importing static images
import mep from '../assets/mep.jpg';
import centralAC from '../assets/Central Air Conditioning Unit.jpg';
import plumbingSet from '../assets/Professional Plumbing Set.jpg';
import fireExtinguisher from '../assets/Fire Extinguisher.jpg';
import hvacSystem from '../assets/HVAC System.jpg';
import waterHeater from '../assets/Water Heater.jpg';
import fireAlarm from '../assets/Fire Alarm System.jpg';
 
const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="hero py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="hero-title">Professional Mechanical Equipment</h1>
              <p className="hero-text">Find the best air conditioning, plumbing, and fire fighting equipment for your projects.</p>
              <Button as={Link} to="/products" variant="primary" size="lg">Shop Now</Button>
            </Col>
            <Col lg={6}>
            
              <img src={mep} alt="Mechanical Equipment" className="img-fluid rounded shadow" />
            
            </Col>
          </Row>
        </Container>
      </section>

      {/* Carousel Section */}
      <section className="products-section py-5">
        <Container>
          <h2 className="section-title text-center mb-4">Featured Products</h2>
          <Carousel>
            <Carousel.Item>
              <Row>
                <Col md={4}><ProductCard src={centralAC} title="Central Air Conditioning Unit" price="$1,299.99" /></Col>
                <Col md={4}><ProductCard src={plumbingSet} title="Professional Plumbing Set" price="$299.99" /></Col>
                <Col md={4}><ProductCard src={fireExtinguisher} title="Fire Safety Equipment" price="$199.99" /></Col>
              </Row>
            </Carousel.Item>
            <Carousel.Item>
              <Row>
                <Col md={4}><ProductCard src={hvacSystem} title="HVAC Control System" price="$899.99" /></Col>
                <Col md={4}><ProductCard src={waterHeater} title="Industrial Water Heater" price="$99.99" /></Col>
                <Col md={4}><ProductCard src={fireAlarm} title="Fire Alarm System" price="$599.99" /></Col>
              </Row>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>
    </>
  );
};

const ProductCard = ({ src, title, price }) => (
  <div className="product-card">
    <img src={src} alt={title} className="product-image" />
    <div className="product-info">
      <h5>{title}</h5>
      <p className="product-price">{price}</p>
    </div>
  </div>
);

export default Home;
