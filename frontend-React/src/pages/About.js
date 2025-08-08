import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function About() {
  return (
    <>
      {/* About Section */}
      <Container className="mt-5 mb-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <h1 className="text-center mb-5">About MechObject</h1>

            <div className="mb-5">
              <h3>Our Story</h3>
              <p>MechObject was founded with a simple mission: to provide high-quality mechanical equipment and solutions to professionals and businesses worldwide. With over a decade of experience in the industry, we understand the unique challenges faced by our customers and strive to deliver products that exceed expectations.</p>
            </div>

            <div className="mb-5">
              <h3>What We Offer</h3>
              <p>We specialize in three main categories of mechanical equipment:</p>
              <ul>
                <li><strong>Air Conditioning:</strong> Commercial and residential HVAC systems, parts, and accessories</li>
                <li><strong>Plumbing:</strong> Professional plumbing tools, fixtures, and supplies</li>
                <li><strong>Fire Fighting:</strong> Safety equipment, fire extinguishers, and emergency response systems</li>
              </ul>
            </div>

            <div className="mb-5">
              <h3>Our Commitment</h3>
              <p>At MechObject, we are committed to:</p>
              <ul>
                <li>Providing only the highest quality products from trusted manufacturers</li>
                <li>Offering competitive prices and excellent customer service</li>
                <li>Supporting our customers with expert advice and technical support</li>
                <li>Continuously expanding our product range to meet evolving needs</li>
              </ul>
            </div>

            <div className="mb-5">
              <h3>Why Choose Us?</h3>
              <p>When you choose MechObject, you're partnering with a company that understands your business needs. Our team of experts is always ready to help you find the right solutions, whether you're working on a small residential project or a large commercial installation.</p>
            </div>

            <div className="text-center">
              <h3>Ready to Get Started?</h3>
              <p>Explore our extensive product catalog and discover the quality and reliability that has made MechObject a trusted name in the industry.</p>
              <Button as={Link} to="/products" className="btn-primary btn-lg">Browse Products</Button>
            </div>
          </Col>
        </Row>
      </Container>

    </>
  );
}
