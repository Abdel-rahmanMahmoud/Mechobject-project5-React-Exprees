import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id ? true : false;
  };

  const getFetchOptions = (additionalOptions = {}) => ({
    credentials: "include",
    ...additionalOptions,
  });

  const loadCart = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/cart`, getFetchOptions());
      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cartItems.map((item) => item.productId));
      }
    } catch (err) {
      console.error("Error loading cart");
    }
  };

  const loadFavorites = async () => {
    try {
      await loadCart();
      const response = await fetch(`${REACT_APP_API_BASE_URL}/favorites`, getFetchOptions());
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.data.favorites);
      } else {
        setError("Error loading favorites");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/cart`, getFetchOptions({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 })
      }));
      if (response.ok) {
        setCart((prev) => [...prev, productId]);
      } else {
        alert("Failed to add to cart");
      }
    } catch {
      alert("Network error");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/cart/${productId}`, getFetchOptions({ method: "DELETE" }));
      if (response.ok) {
        setCart((prev) => prev.filter((id) => id !== productId));
      } else {
        alert("Failed to remove from cart");
      }
    } catch {
      alert("Network error");
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/favorites/${productId}`, getFetchOptions({ method: "DELETE" }));
      if (response.ok) {
        loadFavorites();
      } else {
        alert("Failed to remove from favorites");
      }
    } catch {
      alert("Network error");
    }
  };

  const viewProduct = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login");
    } else {
      loadFavorites();
    }
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2 className="text-white mb-4">My Favorites</h2>
      {favorites.length === 0 ? (
        <div className="text-center">
          <h4 className="text-white">No favorites yet</h4>
          <p className="text-light">Start adding products to your favorites!</p>
          <Button variant="primary" onClick={() => navigate("/products")}>Browse Products</Button>
        </div>
      ) : (
        <Row>
          {favorites.map(({ product }) => {
            const inCart = cart.includes(product.id);
            return (
              <Col md={6} key={product.id} className="mb-4">
                <Card bg="dark" text="light" className="h-100">
                  <Card.Img variant="top" src={
                    product.image
                      ? `http://localhost:8000/uploads/products/${product.image}`
                      : "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=1024x1024&w=is&k=20&c=Bs1RdueQnaAcO888WBIQsC6NvA7aVTzeRVzSd8sJfUg="
                  } height="200px" style={{ objectFit: "cover" }} />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="flex-grow-1">{product.description}</Card.Text>
                    <Card.Text className="fw-bold text-primary">${product.price}</Card.Text>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button variant="info" size="sm" onClick={() => viewProduct(product.id)}>View</Button>
                      {!inCart ? (
                        <Button variant="success" size="sm" onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                      ) : (
                        <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(product.id)}>Remove from Cart</Button>
                      )}
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFromFavorites(product.id)}>Remove</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;
