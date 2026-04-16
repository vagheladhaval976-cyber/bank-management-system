import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Building2 size={24} color="#10B981" />
        BankPro
      </Link>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
        {user && (
          <>
            <span style={{ marginRight: '1rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} />
              {user.firstName} {user.lastName}
            </span>
            <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#EF4444', border: '1px solid #EF4444' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
