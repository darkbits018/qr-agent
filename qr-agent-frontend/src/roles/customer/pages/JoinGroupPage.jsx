import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { customerApi } from '../api/customerApi';

const JoinGroupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract org_id, table_id, group_id from URL
  const params = new URLSearchParams(location.search);
  const orgId = params.get('org_id');
  const tableId = params.get('table_id');
  const groupId = params.get('group_id');

  useEffect(() => {
    // Store in localStorage/sessionStorage if needed
    if (orgId) localStorage.setItem('organization_id', orgId);
    if (tableId) localStorage.setItem('table_id', tableId);
    if (groupId) localStorage.setItem('group_id', groupId);
  }, [orgId, tableId, groupId]);

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Call joinGroup API
      const result = await customerApi.joinGroup(groupId, formData.name);
      if (result && result.member_token) {
        localStorage.setItem('member_token', result.member_token);
        localStorage.setItem('customer_name', formData.name);
        navigate('/customer/order-mode');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md card glow-ring bg-[#EEF1F4] p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Join Group</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field w-full"
            placeholder="Enter your name"
          />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Joining...' : 'Join Group'}
        </button>
      </form>
    </div>
  );
};

export default JoinGroupPage;