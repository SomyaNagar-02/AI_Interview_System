// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("Attempting login..."); // Debug log
      
      const response = await axios.post(
        '/api/v1/auth/login',
        formData,
        { withCredentials: true }
      );

      console.log("Login Response:", response.data); // Debug log

      const { user, accessToken } = response.data.data;
      
      console.log("User:", user); // Debug log
      console.log("Token:", accessToken); // Debug log
      
      // Store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken); // Changed from 'accessToken' to 'token'
      localStorage.setItem('accessToken', accessToken); // Keep this too for backward compatibility
      
      console.log("Stored in localStorage:"); // Debug log
      console.log("- token:", localStorage.getItem('token'));
      console.log("- user:", localStorage.getItem('user'));

      // Redirect based on role
      if (user.role === 'recruiter') {
        navigate('/InterviewerDashboard');
      } else if (user.role === 'applicant') {
        navigate('/ApplicantDashboard');
      } else {
        setError('Invalid user role');
      }
    } catch (err) {
      console.error("Login Error:", err); // Debug log
      console.error("Error Response:", err.response?.data); // Debug log
      
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p className="subtitle">Welcome back! Please login to your account.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;



