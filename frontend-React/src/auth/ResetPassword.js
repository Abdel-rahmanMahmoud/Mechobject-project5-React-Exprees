import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ message: '', type: 'danger' });
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) navigate('/products');

    if (!token || !id) {
      setAlert({ message: 'Invalid reset link. Please request a new password reset.', type: 'warning' });
    }
  }, [token, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ message: 'Passwords do not match', type: 'danger' });
      return;
    }

    if (!token || !id) {
      setAlert({ message: 'Invalid reset link. Please request a new password reset.', type: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id, password })
      });

      const data = await response.json();
      if (response.ok) {
        setAlert({ message: 'Password reset successfully! Redirecting to login...', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setAlert({ message: data.message || 'Failed to reset password.', type: 'danger' });
      }
    } catch (err) {
      setAlert({ message: 'Network error. Please try again.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="text-center mb-4">
          <h2>Reset Password</h2>
          <p>Enter your new password below</p>
        </div>

        {alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="btn-primary w-100 mb-3" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form>

        <div className="text-center">
          <a href="/login" className="text-decoration-none">&larr; Back to Login</a>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
