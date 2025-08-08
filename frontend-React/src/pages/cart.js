import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Image,
  Spinner,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return navigate("/login");
    loadCartItems();
  }, []);

  const getFetchOptions = (additionalOptions = {}) => ({
    credentials: "include",
    ...additionalOptions,
  });

  const loadCartItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, getFetchOptions());
      const data = await res.json();
      setCartItems(data.data.cartItems);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    try {
      await fetch(
        `${API_BASE_URL}/cart/${productId}`,
        getFetchOptions({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        })
      );
      loadCartItems();
    } catch (error) {
      alert("Failed to update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await fetch(
        `${API_BASE_URL}/cart/${productId}`,
        getFetchOptions({ method: "DELETE" })
      );
      loadCartItems();
    } catch (error) {
      alert("Failed to remove item");
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return alert("Cart is empty");
    navigate("/payment");
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      alert("Logout failed");
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return (
    <>
      <Container className="my-5 text-white">
        <h2>Shopping Cart</h2>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center p-5">
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <Button href="/products">Browse Products</Button>
          </div>
        ) : (
          <Row>
            <Col md={8}>
              {cartItems.map(({ product, quantity }) => (
                <Card
                  className="mb-3 bg-dark text-white cart-item"
                  key={product.id}
                >
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <Image
                          src={
                            product.image
                              ? `http://localhost:8000/uploads/products/${product.image}`
                              : "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg"
                          }
                          rounded
                          fluid
                          className="cart-item-image"
                        />
                      </Col>
                      <Col md={3}>
                        <div className="cart-item-info">
                          <h5>{product.name}</h5>
                          <p className="text-muted">{product.category}</p>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="cart-item-price">${product.price}</div>
                      </Col>
                      <Col md={3}>
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="quantity-display">{quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </Col>
                      <Col md={2}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(product.id)}
                          className="w-100"
                        >
                          DEl
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col md={4}>
              <Card className="bg-dark text-white cart-summary">
                <Card.Body>
                  <h4>Order Summary</h4>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="total-row">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <Button
                    variant="success"
                    className="w-100 mt-3"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Cart;
