import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { WalletCards, ArrowDownToLine, ArrowUpFromLine, Send, History } from 'lucide-react';

const Dashboard = () => {
  const { user, token, updateBalance } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const [activeTab, setActiveTab] = useState('overview'); // overview, deposit, withdraw, transfer
  const [txForm, setTxForm] = useState({ amount: '', targetAccountNumber: '', description: '' });
  const [txLoading, setTxLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await api.get('/account/details');
      setProfile(res.data.data || res.data.account);
    } catch (err) {
      console.log('Error fetching details', err);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const res = await api.get('/transaction/history');
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.log('Error fetching history', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDetails();
      fetchTransactions();
    }
  }, [token]);

  const handleTransaction = async (e, type) => {
    e.preventDefault();
    setTxLoading(true);
    setMessage('');
    setError('');

    try {
      let endpoint = `/transaction/${type}`;
      let payload = { amount: Number(txForm.amount) };
      
      if (type === 'transfer') {
        payload.targetAccountNumber = txForm.targetAccountNumber;
      }
      if (txForm.description) {
         payload.description = txForm.description;
      }

      const res = await api.post(endpoint, payload);
      
      if (res.data.success) {
        setMessage(res.data.message || 'Transaction successful');
        setTxForm({ amount: '', targetAccountNumber: '', description: '' });
        fetchDetails(); // update balance
        fetchTransactions(); // update history
        updateBalance(res.data.newBalance || res.data.balance || (profile?.balance));
      } else {
        setError(res.data.message || 'Transaction failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction error.');
    } finally {
      setTxLoading(false);
    }
  };

  if (!profile) return <div className="main-content">Loading profile...</div>;

  return (
    <div className="main-content animate-fade-in">
      <div className="grid-cols-2">
        {/* Left Col: Balance & Actions */}
        <div>
           <div className="glass-panel card">
             <div className="card-title">
                <WalletCards size={20} color="#4F46E5" />
                Available Balance
             </div>
             <div className="balance-display">
                ₹{profile.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
             </div>
             <p className="text-muted">Account: {profile.accountNumber}</p>
             <p className="text-muted" style={{textTransform: 'capitalize'}}>Type: {profile.accountType}</p>
           </div>

           <div className="glass-panel card">
              <div className="card-title">
                  Quick Actions
              </div>
              <div className="action-grid">
                <button 
                   className={`btn ${activeTab === 'deposit' ? 'btn-primary' : 'btn-secondary'}`} 
                   onClick={() => { setActiveTab('deposit'); setMessage(''); setError(''); }}
                   style={{ marginTop: 0 }}
                >
                  <ArrowDownToLine size={16} /> Deposit
                </button>
                <button 
                  className={`btn ${activeTab === 'withdraw' ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => { setActiveTab('withdraw'); setMessage(''); setError(''); }}
                  style={{ marginTop: 0 }}
                >
                  <ArrowUpFromLine size={16} /> Withdraw
                </button>
                <button 
                  className={`btn ${activeTab === 'transfer' ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => { setActiveTab('transfer'); setMessage(''); setError(''); }}
                  style={{ marginTop: 0 }}
                >
                  <Send size={16} /> Transfer
                </button>
              </div>

              {activeTab !== 'overview' && (
                <div className="mt-4 animate-fade-in" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <h3 className="mb-4 text-capitalize" style={{ textTransform: 'capitalize' }}>{activeTab} Funds</h3>
                  
                  {message && <div className="alert alert-success">{message}</div>}
                  {error && <div className="alert alert-error">{error}</div>}

                  <form onSubmit={(e) => handleTransaction(e, activeTab)}>
                    <div className="form-group">
                      <label className="form-label">Amount (₹)</label>
                      <input 
                        type="number" 
                        min="1"
                        className="form-input" 
                        placeholder="Enter amount"
                        value={txForm.amount}
                        onChange={(e) => setTxForm({...txForm, amount: e.target.value})}
                        required
                      />
                    </div>

                    {activeTab === 'transfer' && (
                      <div className="form-group">
                        <label className="form-label">Target Account Number</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="3950..."
                          value={txForm.targetAccountNumber}
                          onChange={(e) => setTxForm({...txForm, targetAccountNumber: e.target.value})}
                          required
                        />
                      </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Reason for transaction"
                          value={txForm.description}
                          onChange={(e) => setTxForm({...txForm, description: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={txLoading}>
                       {txLoading ? 'Processing...' : `Confirm ${activeTab}`}
                    </button>
                  </form>
                </div>
              )}
           </div>
        </div>

        {/* Right Col: Recent Transactions */}
        <div>
           <div className="glass-panel card" style={{ height: '100%', minHeight: '500px' }}>
              <div className="card-title">
                  <History size={20} color="#10B981" />
                  Recent Transactions
              </div>
              
              {loadingTransactions ? (
                <p className="text-muted text-center mt-4">Loading history...</p>
              ) : transactions.length === 0 ? (
                <p className="text-muted text-center mt-4">No transactions found.</p>
              ) : (
                <ul className="transaction-list">
                  {transactions.slice(0, 10).map((tx) => {
                    // Logic to determine if money came in or went out
                    const isCredit = tx.type === 'Deposit' || (tx.type === 'Transfer' && tx.receiverAccountNumber === profile.accountNumber);
                    
                    return (
                      <li key={tx._id} className="transaction-item animate-fade-in">
                        <div className="transaction-icon">
                          <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: isCredit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                            {isCredit ? <ArrowDownToLine size={20} color="#10B981" /> : <ArrowUpFromLine size={20} color="#EF4444" />}
                          </div>
                          <div>
                             <p style={{ fontWeight: 600 }}>{tx.type}</p>
                             <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                               {new Date(tx.date).toLocaleDateString()} • {tx.description || 'N/A'}
                             </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p className={isCredit ? 'amount-positive' : 'amount-negative'}>
                            {isCredit ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}
                          </p>
                          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                            Bal: ₹{tx.balanceAfterTransaction?.toLocaleString('en-IN') || '...'}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
