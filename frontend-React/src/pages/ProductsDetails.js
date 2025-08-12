import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Image,
  Button,
  Spinner,
  Form,
  Card,
} from "react-bootstrap";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import "../styles/productsDetails.css";

export default function ProductDetails() {
  const REACT_APP_API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";
  const REACT_APP_API_IMG =
    process.env.REACT_APP_API_IMG || "http://localhost:8000/uploads/products";
  const navigate = useNavigate();
  const location = useLocation();
  const { id: idParam } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const getIdFromQuery = () => new URLSearchParams(location.search).get("id");
  const idFromQuery = getIdFromQuery();
  const id = idParam || idFromQuery;

  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return !!user.id;
  };

  const getFetchOptions = (additional = {}) => ({
    credentials: "include",
    ...additional,
  });

  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login");
      return;
    }
    if (!id) {
      navigate("/products");
      return;
    }
    if (!idParam && idFromQuery) {
      navigate(`/product-details/${id}`, { replace: true });
      return;
    }
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam, location.search]);

  async function loadUserData() {
    try {
      const favRes = await fetch(
        `${REACT_APP_API_BASE_URL}/favorites`,
        getFetchOptions()
      );
      if (favRes.ok) {
        const d = await favRes.json();
        setFavorites(d.data.favorites.map((f) => f.productId));
      }
      const cartRes = await fetch(
        `${REACT_APP_API_BASE_URL}/cart`,
        getFetchOptions()
      );
      if (cartRes.ok) {
        const d = await cartRes.json();
        setCart(d.data.cartItems.map((i) => i.productId));
      }
    } catch {}
  }

  async function loadProduct() {
    const productId = idParam || idFromQuery;
    if (!productId) {
      navigate("/products");
      return;
    }
    setLoading(true);
    try {
      await loadUserData();
      const res = await fetch(
        `${REACT_APP_API_BASE_URL}/products/${productId}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProduct(data.data.product);
      setQuantity(1);
    } catch {
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }

  const changeQuantity = (delta) => {
    if (!product) return;
    const n = quantity + delta;
    if (n >= 1 && n <= product.stock) setQuantity(n);
  };

  const onSetQuantity = (val) => {
    if (!product) return;
    const n = parseInt(val, 10) || 1;
    if (n >= 1 && n <= product.stock) setQuantity(n);
  };

  async function addToCart() {
    if (!product) return;
    try {
      const res = await fetch(
        `${REACT_APP_API_BASE_URL}/cart`,
        getFetchOptions({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity }),
        })
      );
      if (!res.ok) throw new Error();
      setCart((p) => [...p, product.id]);
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
    } catch {
      alert("Failed to add to cart");
    }
  }

  async function removeFromCart() {
    if (!product) return;
    try {
      const res = await fetch(
        `${REACT_APP_API_BASE_URL}/cart/${product.id}`,
        getFetchOptions({ method: "DELETE" })
      );
      if (!res.ok) throw new Error();
      setCart((p) => p.filter((i) => i !== product.id));
      alert("Removed from cart!");
    } catch {
      alert("Failed to remove from cart");
    }
  }

  async function toggleFavorite() {
    if (!product) return;
    const isFav = favorites.includes(product.id);
    try {
      if (isFav) {
        const res = await fetch(
          `${REACT_APP_API_BASE_URL}/favorites/${product.id}`,
          getFetchOptions({ method: "DELETE" })
        );
        if (!res.ok) throw new Error();
        setFavorites((f) => f.filter((i) => i !== product.id));
      } else {
        const res = await fetch(
          `${REACT_APP_API_BASE_URL}/favorites`,
          getFetchOptions({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
          })
        );
        if (!res.ok) throw new Error();
        setFavorites((f) => [...f, product.id]);
      }
    } catch {
      alert("Network error. Please try again.");
    }
  }

  const logout = async () => {
    try {
      await fetch(`${REACT_APP_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      navigate("/");
    } catch {
      alert("Logout failed");
    }
  };

  if (loading)
    return (
      <>
        <Navbar expand="lg" className="bg-dark" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to="/">
              MechObject
            </Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/products">
                {" "}
                ←Back to Products
              </Nav.Link>
              <Nav.Link as={Link} to="/cart">
                Cart
              </Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container className="my-5 text-white text-center">
          <Spinner animation="border" />
        </Container>
      </>
    );

  if (!product) return null;

  const inCart = cart.includes(product.id);
  const isFavorite = favorites.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <Navbar expand="lg" className="bg-dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            MechObject
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/products">
              Back to Products
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart
            </Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="my-5 text-white">
        <Card className="product-details-card">
          <Card.Body>
            <Row>
              <Col lg={6}>
                <Image
                  src={
                    product.image
                      ? `${REACT_APP_API_IMG}/${product.image}`
                      : "https://feed.muzli.cloud/muzli_feed/wp-content/uploads/2024/02/19135000/404-2.png"
                  }
                  alt={product.name}
                  fluid
                  className="product-image"
                />
              </Col>
              <Col lg={6}>
                <h1 className="product-title">{product.name}</h1>
                <div className="product-category">{product.category}</div>
                <div className="product-price">${product.price}</div>
                <div
                  className={`product-stock ${
                    isOutOfStock ? "out-of-stock" : ""
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : `${product.stock} items in stock`}
                </div>
                <p className="product-description">{product.description}</p>

                {!isOutOfStock && (
                  <div className="quantity-selector mb-3">
                    <label>Quantity:</label>
                    <div className="d-flex align-items-center mt-2">
                      <Button
                        variant="primary"
                        onClick={() => changeQuantity(-1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => onSetQuantity(e.target.value)}
                        className="mx-2 quantity-input"
                        style={{ width: "100px" }}
                        min={1}
                        max={product.stock}
                      />
                      <Button
                        variant="primary"
                        onClick={() => changeQuantity(1)}
                        disabled={quantity >= product.stock}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                <div className="product-actions">
                  {!isOutOfStock && !inCart && (
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={addToCart}
                    >
                      Add to Cart
                    </Button>
                  )}
                  {inCart && (
                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={removeFromCart}
                    >
                      Remove from Cart
                    </Button>
                  )}
                  {isOutOfStock && (
                    <Button variant="secondary" disabled>
                      Out of Stock
                    </Button>
                  )}
                  <Button
                    variant={isFavorite ? "outline-danger" : "outline-primary"}
                    onClick={toggleFavorite}
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
