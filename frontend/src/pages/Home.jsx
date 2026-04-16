import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="auth-container">
      <div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px', textAlign: 'center' }}>
        <h1 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #4F46E5, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to BankPro
        </h1>
        <p className="animate-fade-in" style={{ color: '#94A3B8', fontSize: '1.25rem', marginBottom: '3rem', animationDelay: '0.1s' }}>
          The next generation of digital banking. Secure, fast, and reliable.
        </p>

        <div className="grid-cols-2" style={{ marginBottom: '3rem', gap: '1.5rem', textAlign: 'left' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <ShieldCheck size={32} color="#10B981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Bank Grade Security</h3>
            <p className="text-muted">Your assets are protected by industry-leading encryption.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <Zap size={32} color="#F59E0B" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Instant Transfers</h3>
            <p className="text-muted">Send money anywhere in the world in seconds, not days.</p>
          </div>
        </div>

        <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', animationDelay: '0.2s' }}>
          <Link to="/login" className="btn btn-primary" style={{ width: 'auto' }}>
            Login to Account
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ width: 'auto', marginTop: 0 }}>
            Open an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
