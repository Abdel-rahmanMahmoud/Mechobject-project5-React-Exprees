import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { auth, GoogleAuthProvider, FacebookAuthProvider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const API_BASE_URL = process.env.API_BASE_URL ;
console.log(`API_BASE_URL: ${API_BASE_URL}`);


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ message: '', variant: 'danger' });

  const navigate = useNavigate();

  const showMessage = (message, variant = 'danger') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert({ message: '', variant: 'danger' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        showMessage('Login successful!', 'success');
        setTimeout(() => navigate('/products'), 1000);
      } else {
        showMessage(data.message || 'Login failed');
      }
    } catch {
      showMessage('Network error. Please try again.');
    }
  };

  const handleSocialLogin = async (providerType) => {
    try {
      const provider = providerType === 'google'
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const userData = {
        id: user.uid,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || 'Name',
        email: user.email,
        role: 'USER',
        avatar: user.photoURL || 'profile.png'
      };

      const response = await fetch(`${API_BASE_URL}/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken, userData })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.data.user));
        showMessage(`${providerType} sign-in successful!`, 'success');
        setTimeout(() => navigate('/products'), 1000);
      } else {
        showMessage('Authentication failed. Please try again.');
      }
    } catch {
      showMessage(`${providerType} sign-in failed. Please try again.`);
    }
  };

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <div className="text-center mb-4">
          <h2>MechObject</h2>
          <p>Welcome back! Please login to your account</p>
        </div>

        {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </Form.Group>

          <Button type="submit" className="btn-primary form-btn w-100 mb-3">Login</Button>
        </Form>

        <div className="text-center mb-3">
          <p>Or login with:</p>
          <Button className="btn-google me-2" onClick={() => handleSocialLogin('google')}>Google</Button>
          <Button className="btn-facebook" onClick={() => handleSocialLogin('facebook')}>Facebook</Button>
        </div>

        <div className="text-center">
          <p>Don't have an account? <a href="/register">Register here</a></p>
          <p><a href="/forgot-password">Forgot Password?</a></p>
          <p><a href="/">← Back to Home</a></p>
        </div>
      </Card>
    </Container>
  );
}

export default Login;
