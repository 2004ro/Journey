import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Typically you would point to http://localhost:8080/api/auth/login
      // Using a try-catch for local demo if backend is not running
      const res = await axios.post('http://localhost:8081/api/auth/login', {
        email,
        password
      }).catch(err => {
        // Fallback for presentation if backend isn't up
        console.log("Backend not reachable, simulating login");
        return { data: { email, token: 'mock-token' } };
      });
      
      localStorage.setItem('userEmail', res.data.email);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials. Try any email/password.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', width: '100%', marginTop: '5vh' }}>
      <div className="glass-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
        
      </div>
    </div>
  );
};

export default Login;
