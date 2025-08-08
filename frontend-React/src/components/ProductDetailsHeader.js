import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailsHeader({ onLogout }) {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    navigate('/products');
  };

  return (
    <Navbar expand="lg" className="bg-dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">MechObject</Navbar.Brand>
        <div className="navbar-nav ms-auto">
          <a className="nav-link" href="/products" onClick={handleBack}>Back to Products</a>
          <a className="nav-link" href="/cart">Cart</a>
          <a className="nav-link" href="#" onClick={onLogout}>Logout</a>
        </div>
      </Container>
    </Navbar>
  );
}
