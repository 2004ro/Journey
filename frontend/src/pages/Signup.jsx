import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    // For demo we simply save email/name locally and redirect to login
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    setMsg('Account created (demo). Redirecting to dashboard...');
    setTimeout(() => window.location.href = '/dashboard', 1000);
  };

  return (
    <div style={{ maxWidth: '480px', width: '100%', marginTop: '6vh' }}>
      <div className="glass-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an account</h2>
        {msg && <div style={{ color: 'var(--success)', textAlign: 'center' }}>{msg}</div>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create Account</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
