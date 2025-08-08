// src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Form,
  Card,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/payment.css"; 

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

const getFetchOptions = (additional = {}) => ({
  credentials: "include",
  ...additional,
});

const checkAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return !!user.id;
};

export default function Payment() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login");
      return;
    }
    loadUserInfo();
    loadOrderSummary();
    // eslint-disable-next-line
  }, []);

  async function loadOrderSummary() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/cart`, getFetchOptions());
      if (!res.ok) throw new Error("failed to fetch cart");
      const data = await res.json();
      const items = data.data.cartItems || [];
      setCart(items);
      const total = items.reduce(
        (s, it) => s + parseFloat(it.product.price) * it.quantity,
        0
      );
      setTotalAmount(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCustomer((c) => ({
      ...c,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    }));
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setCustomer((c) => ({ ...c, [name]: value }));
  }

  async function processPayment(e) {
    e?.preventDefault();
    // simple validation
    if (!customer.firstName || !customer.email || !customer.address) {
      alert("Please complete required customer fields.");
      return;
    }

    setProcessing(true);
    try {
      // mock PayPal processing delay
      await new Promise((r) => setTimeout(r, 1500));

      const orderData = {
        items: cart.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
        customerInfo: customer,
      };

      const res = await fetch(
        `${API_BASE_URL}/orders`,
        getFetchOptions({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })
      );

      if (!res.ok) throw new Error("order creation failed");

      // clear cart on backend
      await fetch(
        `${API_BASE_URL}/cart`,
        getFetchOptions({ method: "DELETE" })
      );

      // navigate to success page or show inline success
      navigate("/payment-success", { state: { total: totalAmount } });
    } catch (err) {
      console.error(err);
      alert("Payment or order creation failed. Try again.");
    } finally {
      setProcessing(false);
    }
  }

  async function logout(e) {
    e?.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  }

  return (
    <>
      <Navbar expand="lg" className="bg-dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            MechObject
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart">
              Back to Cart
            </Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4 mb-5">
        <Row>
          <Col lg={8}>
            <Card className="payment-card bg-dark text-white border-0">
              <Card.Body>
                <h3>Checkout</h3>

                <Form onSubmit={processPayment} className="mt-4">
                  <h5 className="text-primary mb-3">Customer Information</h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          name="firstName"
                          value={customer.firstName}
                          onChange={handleInput}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          name="lastName"
                          value={customer.lastName}
                          onChange={handleInput}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={handleInput}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      name="phone"
                      value={customer.phone}
                      onChange={handleInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={customer.address}
                      onChange={handleInput}
                      required
                    />
                  </Form.Group>

                  <h5 className="text-primary mb-3">Payment Method</h5>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      id="paypalRadio"
                      name="paymentMethod"
                      label="PayPal"
                      defaultChecked
                      inline
                    />
                    <Form.Check
                      type="radio"
                      id="cardRadio"
                      name="paymentMethod"
                      label="Credit/Debit Card (Coming Soon)"
                      inline
                      disabled
                    />
                  </Form.Group>

                  <Card className="paypal-mock bg-dark border-primary mb-3">
                    <Card.Body className="text-center">
                      <div className="paypal-logo-large text-primary">
                        PayPal
                      </div>
                      <p className="mt-2">
                        You will be redirected to PayPal to complete your
                        payment securely.
                      </p>
                      <div className="paypal-amount text-primary mb-3">
                        Total: ${totalAmount.toFixed(2)}
                      </div>
                      <Button
                        variant="warning"
                        onClick={processPayment}
                        disabled={processing}
                      >
                        {processing ? "Processing..." : "Pay with PayPal"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="order-summary bg-dark text-white border-0">
              <Card.Body>
                <h5>Order Summary</h5>

                {loading ? (
                  <div className="text-center my-4">
                    <Spinner />
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-4">
                    <p>Your cart is empty</p>
                    <Button as={Link} to="/products">
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <ListGroup variant="flush" className="mb-3">
                    {cart.map((c) => {
                      const itemTotal =
                        parseFloat(c.product.price) * c.quantity;
                      return (
                        <ListGroup.Item
                          key={c.productId}
                          className="bg-dark border-0 px-0"
                        >
                          <div className="d-flex justify-content-between align-items-center py-2">
                            <div>
                              <h6 className="mb-1">{c.product.name}</h6>
                              <div className="text-muted small">
                                Qty: {c.quantity}
                              </div>
                            </div>
                            <div className="text-primary fw-bold">
                              ${itemTotal.toFixed(2)}
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                )}

                <div className="order-total border-top border-secondary pt-3">
                  <div className="d-flex justify-content-between total-row">
                    <span>Total:</span>
                    <span className="text-primary">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={processPayment}
                    disabled={processing || cart.length === 0}
                  >
                    {processing ? "Processing..." : "Proceed to Pay"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
