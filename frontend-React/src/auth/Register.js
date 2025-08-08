import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import {
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/products");
  }, [navigate]);

  const showMessage = (message, type = "danger") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      showMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
        showMessage("Registration successful!", "success");
        setTimeout(() => navigate("/products"), 1000);
      } else {
        showMessage(data.message || "Registration failed");
      }
    } catch {
      showMessage("Network error. Please try again.");
    }
  };

  const handleFirebaseLogin = async (providerType) => {
    const provider =
      providerType === "google"
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const userData = {
        id: user.uid,
        firstName: user.displayName?.split(" ")[0] || "User",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "Name",
        email: user.email,
        role: "USER",
        avatar: user.photoURL || "profile.png",
      };

      const res = await fetch(`${API_BASE_URL}/auth/firebase-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken, userData }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.data.user));
        showMessage("Social registration successful!", "success");
        setTimeout(() => navigate("/products"), 1000);
      } else {
        showMessage("Registration failed. Please try again.");
      }
    } catch {
      showMessage(`${providerType} registration failed. Please try again.`);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="text-center mb-4">
          <h2>MechObject</h2>
          <p>Create your account and start shopping</p>
        </div>

        {alert.message && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" className="btn-primary form-btn w-100 mb-3">
            Create Account
          </Button>
        </Form>

        <div className="text-center mb-3">
          <p>Or register with:</p>
          <Button
            className="btn-google me-2"
            onClick={() => handleFirebaseLogin("google")}
          >
            Google
          </Button>
          <Button
            className="btn-facebook"
            onClick={() => handleFirebaseLogin("facebook")}
          >
            Facebook
          </Button>
        </div>

        <div className="text-center">
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
          <p>
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
