import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/AdminRegister.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post("https://code-repo-jrfq.onrender.com/api/admins/register", formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess("Admin registration successful! Redirecting to login...");
      
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.response) {
        setError(err.response?.data?.message || "Registration failed");
      } else if (err.request) {
        setError("Cannot connect to server. Please try again later.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-background">
        <div className="admin-register-card">
          <div className="admin-register-header">
            <div className="admin-register-icon">🛡️</div>
            <h2 className="admin-register-title">Admin Registration</h2>
            <p className="admin-register-subtitle">
              Create administrator account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="admin-register-form">
            {error && (
              <div className="admin-error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className="admin-success-message">
                <span className="success-icon">✅</span>
                {success}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="username" className="input-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                className="admin-input"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                className="admin-input"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                className="admin-input"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                className="admin-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="role" className="input-label">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="admin-input"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="admin-register-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Register Admin'
              )}
            </button>
          </form>

          <div className="admin-register-footer">
            <p className="admin-footer-text">
              Already have an account?{" "}
              <Link to="/admin/login" className="admin-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;