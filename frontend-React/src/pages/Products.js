import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Alert,
  Pagination,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/products.css";

const REACT_APP_API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";
const REACT_APP_API_IMG =
  process.env.REACT_APP_API_IMG || "http://localhost:8000/uploads/products";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  console.log(products);

  useEffect(() => {
    loadProducts(currentPage, currentCategory);
    // eslint-disable-next-line
  }, [currentPage, currentCategory]);

  const getFetchOptions = (additional = {}) => ({
    credentials: "include",
    ...additional,
  });

  const loadProducts = async (page, category) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
    try {
      const favRes = await fetch(
        `${REACT_APP_API_BASE_URL}/favorites`,
        getFetchOptions()
      );
      const cartRes = await fetch(
        `${REACT_APP_API_BASE_URL}/cart`,
        getFetchOptions()
      );
      if (favRes.ok && cartRes.ok) {
        const favData = await favRes.json();
        const cartData = await cartRes.json();
        setFavorites(favData.data.favorites.map((f) => f.productId));
        setCart(cartData.data.cartItems.map((i) => i.productId));
      }

      let url = `${REACT_APP_API_BASE_URL}/products?page=${page}&limit=4`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      const prodRes = await fetch(url);
      const prodData = await prodRes.json();

      if (prodRes.ok) {
        setProducts(prodData.data.products);
        setTotalPages(prodData.data.totalPages);
        setCurrentPage(prodData.data.currentPage);
      }
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const toggleFavorite = async (productId) => {
    const isFav = favorites.includes(productId);
    try {
      const url = `${REACT_APP_API_BASE_URL}/favorites${
        isFav ? `/${productId}` : ""
      }`;
      const options = getFetchOptions({
        method: isFav ? "DELETE" : "POST",
        headers: isFav ? {} : { "Content-Type": "application/json" },
        body: isFav ? null : JSON.stringify({ productId }),
      });
      const res = await fetch(url, options);
      if (res.ok) {
        loadProducts(currentPage, currentCategory);
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const toggleCart = async (productId) => {
    const inCart = cart.includes(productId);
    try {
      const url = `${REACT_APP_API_BASE_URL}/cart${
        inCart ? `/${productId}` : ""
      }`;
      const options = getFetchOptions({
        method: inCart ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: inCart ? null : JSON.stringify({ productId, quantity: 1 }),
      });
      const res = await fetch(url, options);
      if (res.ok) {
        loadProducts(currentPage, currentCategory);
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const viewProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <Container className="mt-4 text-white">
      <Row>
        <Col md={3}>
          <div
            style={{ background: "#222d32", padding: "2rem", borderRadius: 15 }}
          >
            <h4>Categories</h4>
            <ButtonGroup vertical>
              {["", "Air Conditioning", "Plumbing", "Fire Fighting"].map(
                (cat) => (
                  <Button
                    key={cat}
                    variant={
                      currentCategory === cat ? "primary" : "outline-primary"
                    }
                    onClick={() => setCurrentCategory(cat)}
                    className="mb-2 text-start"
                  >
                    {cat || "All Products"}
                  </Button>
                )
              )}
            </ButtonGroup>
          </div>
        </Col>

        <Col md={9}>
          <h3>Products</h3>
          {!isLoggedIn && (
            <Alert variant="warning">
              Please <a href="/login">login</a> to access products.
            </Alert>
          )}
          <Row>
            {products.length === 0 ? (
              <Col className="text-center py-5">No products found</Col>
            ) : (
              products.map((product) => (
                <Col md={6} key={product.id} className="mb-4">
                  <Card
                    style={{
                      background: "#222d32",
                      color: "white",
                      borderRadius: 15,
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        product.image
                          ? `${REACT_APP_API_IMG}/${product.image}`
                          : "https://feed.muzli.cloud/muzli_feed/wp-content/uploads/2024/02/19135000/404-2.png"
                      }
                      style={{ height: 200, objectFit: "cover" }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text style={{ flexGrow: 1 }}>
                        {product.description}
                      </Card.Text>
                      <h5 style={{ color: "#007bff" }}>${product.price}</h5>
                      <div className="d-flex gap-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => viewProduct(product.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant={
                            cart.includes(product.id) ? "danger" : "success"
                          }
                          size="sm"
                          onClick={() => toggleCart(product.id)}
                        >
                          {cart.includes(product.id)
                            ? "Remove from Cart"
                            : "Add to Cart"}
                        </Button>
                        <Button
                          variant={
                            favorites.includes(product.id)
                              ? "danger"
                              : "primary"
                          }
                          size="sm"
                          onClick={() => toggleFavorite(product.id)}
                        >
                          {favorites.includes(product.id)
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              {currentPage > 1 && (
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              )}
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              {currentPage < totalPages && (
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              )}
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
}
