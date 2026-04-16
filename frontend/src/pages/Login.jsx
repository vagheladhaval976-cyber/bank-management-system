import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { KeyRound } from 'lucide-react';

const Login = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { accountNumber, password });
      if (res.data.success) {
        login(res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
       setError(err.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel form-card animate-fade-in">
        <div className="text-center mb-6">
          <KeyRound size={40} color="#4F46E5" style={{ marginBottom: '1rem' }} />
          <h2>Welcome Back</h2>
          <p className="text-muted mt-4">Enter your credentials to access your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="3950..."
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-muted">
              Don't have an account? <Link to="/register" style={{ color: '#4F46E5', textDecoration: 'none' }}>Open one here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
