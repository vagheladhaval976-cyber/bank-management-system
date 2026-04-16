import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accountType: 'saving',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    contactNo: '',
    email: '',
    gender: 'Male',
    address: '',
    proofType: 'aadhar'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });

  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/account/register', formData);
      if (res.data.success) {
        setAccountNumber(res.data.accountNumber || res.data.data?.accountNumber || res.data.account?.accountNumber);
        setSuccess('Account created successfully! Please set a password.');
        setStep(2);
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/set-password', {
        accountNumber,
        password: passwordForm.password
      });

      if (res.data.success) {
        setSuccess('Password set successfully! You can now login.');
        setStep(3);
      } else {
         setError(res.data.message || 'Failed to set password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error setting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel form-card animate-fade-in" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-6">
          <UserPlus size={40} color="#10B981" style={{ marginBottom: '1rem' }} />
          <h2>Open an Account</h2>
          <p className="text-muted mt-4">Connect with the future of banking today.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {step === 1 && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" name="firstName" className="form-input" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" name="lastName" className="form-input" onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid-cols-2">
               <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input type="text" name="contactNo" className="form-input" onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="grid-cols-2">
               <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dob" className="form-input" onChange={handleInputChange} required />
              </div>
               <div className="form-group">
                <label className="form-label">Account Type</label>
                <select name="accountType" className="form-select" onChange={handleInputChange} required>
                  <option value="saving">Savings Account</option>
                  <option value="current">Current Account</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" name="address" className="form-input" onChange={handleInputChange} required />
            </div>

            <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
              {loading ? 'Creating Account... ' : 'Continue ' } <ArrowRight size={18} />
            </button>
            <div className="text-center mt-4">
              <p className="text-muted">
                Already have an account? <Link to="/login" style={{ color: '#10B981', textDecoration: 'none' }}>Login here</Link>
              </p>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="animate-fade-in">
             <div className="form-group">
                <label className="form-label">Your Account Number</label>
                <input type="text" className="form-input" value={accountNumber} readOnly style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#10B981', fontWeight: 'bold' }} />
                <small className="text-muted mb-2 inline-block mt-4" style={{ marginTop: '0.5rem', display: 'block' }}>Please save this number for future logins.</small>
              </div>

             <div className="form-group">
                <label className="form-label">Set Password</label>
                <input type="password" name="password" className="form-input" onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})} required />
             </div>
             
             <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-input" onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required />
             </div>

             <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
              {loading ? 'Setting Password... ' : 'Complete Setup ' } <CheckCircle size={18} />
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="animate-fade-in text-center">
            <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ marginBottom: '1rem' }}>You're all set!</h3>
            <p className="text-muted mb-6">Your BankPro account has been successfully configured.</p>
            <Link to="/login" className="btn btn-primary">Login Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
