import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Table, Form, Button, Modal } from "react-bootstrap";
import AdminHeader from "../components/AdminHeader";
import "../styles/admin.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null
  });

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null
  });

  // Check admin authentication
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!user.id || user.role !== "ADMIN") {
      alert("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    // Load initial data
    loadProducts();
  }, [navigate]);

  // Get fetch options
  const getFetchOptions = (additionalOptions = {}) => {
    return {
      credentials: "include",
      ...additionalOptions
    };
  };

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/products?limit=100`, getFetchOptions());
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.data.products);
      } else {
        console.error("Failed to load products");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/orders`, getFetchOptions());
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.data.orders);
      } else {
        console.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "products") {
      loadProducts();
    } else if (tab === "orders") {
      loadOrders();
    }
  };

  // Handle add product form
  const handleProductFormChange = (e) => {
    const { name, value, files } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Handle add product submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("category", productForm.category);
    formData.append("price", productForm.price);
    formData.append("stock", productForm.stock);
    formData.append("description", productForm.description);
    
    if (productForm.image) {
      formData.append("image", productForm.image);
    }

    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/products`, getFetchOptions({
        method: "POST",
        body: formData
      }));

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        setProductForm({
          name: "",
          category: "",
          price: "",
          stock: "",
          description: "",
          image: null
        });
        loadProducts();
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  // Handle edit product
  const handleEditProduct = async (productId) => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/products/${productId}`, getFetchOptions());
      const data = await response.json();

      if (response.ok) {
        const product = data.data.product;
        setEditForm({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          description: product.description,
          image: null
        });
        setEditingProduct(product);
        setShowEditModal(true);
      } else {
        alert("Failed to load product details");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("category", editForm.category);
    formData.append("price", editForm.price);
    formData.append("stock", editForm.stock);
    formData.append("description", editForm.description);

    if (editForm.image) {
      formData.append("image", editForm.image);
    }

    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/products/${editForm.id}`, getFetchOptions({
        method: "PUT",
        body: formData
      }));

      const data = await response.json();

      if (response.ok) {
        alert("Product updated successfully!");
        setShowEditModal(false);
        loadProducts();
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/products/${productId}`, getFetchOptions({
        method: "DELETE"
      }));

      const data = await response.json();

      if (response.ok) {
        alert("Product deleted successfully!");
        loadProducts();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="badge badge-pending">Pending</span>,
      completed: <span className="badge badge-completed">Completed</span>,
      cancelled: <span className="badge badge-cancelled">Cancelled</span>
    };
    return badges[status] || status;
  };

  return (
    <>
      <AdminHeader />
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} className="sidebar">
            <Nav className="nav nav-pills flex-column">
              <Nav.Link
                className={activeTab === "products" ? "active" : ""}
                onClick={() => handleTabChange("products")}
              >
                Products
              </Nav.Link>
              <Nav.Link
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => handleTabChange("orders")}
              >
                Orders
              </Nav.Link>
              <Nav.Link
                className={activeTab === "add-product" ? "active" : ""}
                onClick={() => handleTabChange("add-product")}
              >
                Add Product
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={10} className="main-content">
            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="tab-content active">
                <h3>Manage Products</h3>
                <div className="table-responsive">
                  <Table striped className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center">Loading...</td>
                        </tr>
                      ) : products.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">No products found</td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                              <div className="action-buttons">
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleEditProduct(product.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="tab-content active">
                <h3>Orders Management</h3>
                <div className="table-responsive">
                  <Table striped className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center">Loading...</td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">No orders found</td>
                        </tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user.firstName} {order.user.lastName}</td>
                            <td>${order.totalAmount}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => alert(`Order details for Order #${order.id} - Feature coming soon!`)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* Add Product Tab */}
            {activeTab === "add-product" && (
              <div className="tab-content active">
                <h3>Add New Product</h3>
                <Form onSubmit={handleAddProduct}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={productForm.category}
                        onChange={handleProductFormChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Air Conditioning">Air Conditioning</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Fire Fighting">Fire Fighting</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        step="0.01"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleProductFormChange}
                        required
                      />
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <Form.Label>Product Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleProductFormChange}
                    />
                  </div>
                  <Button type="submit" variant="primary">
                    Add Product
                  </Button>
                </Form>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={editForm.category}
                onChange={handleEditFormChange}
                required
              >
                <option value="Air Conditioning">Air Conditioning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Fire Fighting">Fire Fighting</option>
              </Form.Select>
            </div>
            <div className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                step="0.01"
                value={editForm.price}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={editForm.stock}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditFormChange}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;