import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import "../styles/contact.css"
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [alert, setAlert] = useState({ message: '', type: '' });

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//   }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ message: 'Message sent successfully! We will get back to you soon.', type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setAlert({ message: data.message || 'Failed to send message. Please try again.', type: 'danger' });
      }
    } catch (error) {
      setAlert({ message: 'Network error. Please try again.', type: 'danger' });
    }
  };

  return (
    <Container className="my-5 text-white">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="text-center mb-4">Contact Us</h1>

          {alert.message && (
            <Alert variant={alert.type}>{alert.message}</Alert>
          )}

          <Card className="bg-dark text-white p-4 mb-4 shadow rounded">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="name">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" value={formData.name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="subject" className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" value={formData.subject} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="message" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={5} value={formData.message} onChange={handleChange} required />
              </Form.Group>
              <div className="text-center">
                <Button type="submit" variant="primary" size="lg">Send Message</Button>
              </div>
            </Form>
          </Card>

          <Card className="bg-dark text-white p-4">
            <Row className="text-center">
              <Col md={4}>
                <h5 className="text-primary">Email</h5>
                <p>abdismahmoud@gmail.com</p>
              </Col>
              <Col md={4}>
                <h5 className="text-primary">Phone</h5>
                <p>+962780384524</p>
              </Col>
              <Col md={4}>
                <h5 className="text-primary">Address</h5>
                <p>Jordan, Irbid<br />Alhudyba, St</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
