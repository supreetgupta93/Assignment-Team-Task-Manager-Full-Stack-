import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!['Admin', 'Member'].includes(role)) {
      newErrors.role = 'Invalid role selected';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('/api/auth/signup', { name, email, password, role });
      setToast({ message: 'Signup successful! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/login'), 500);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Signup failed';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Minimum 8 characters"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-semibold">Login</Link></p>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Signup;