// // src/pages/admin/AdminLogin.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import "../../assets/css/Form.css";

// const AdminLogin = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/admins/login",
//         formData
//       );
//       localStorage.setItem("adminToken", res.data.token);
//       localStorage.setItem("adminData", JSON.stringify(res.data));
//       navigate("/admin/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="form-container">
//       <form className="form-card" onSubmit={handleSubmit}>
//         <h2 className="form-title">Admin Login</h2>
//         {error && <p className="error-text">{error}</p>}

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="form-input"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="form-input"
//           onChange={handleChange}
//           required
//         />

//         <button type="submit" className="form-button">
//           Login
//         </button>

//         <p className="form-footer">
//           Don't have an account?{" "}
//           <Link to="/admin/register" className="form-link">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/AdminLogin.css"; // Import dedicated CSS

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/admins/login",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );
      
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminData", JSON.stringify(res.data));

      // Trigger header update
    window.dispatchEvent(new Event('authChange'));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout - server is taking too long to respond");
      } else if (err.response) {
        setError(err.response?.data?.message || `Login failed: ${err.response.status}`);
      } else if (err.request) {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError("An unexpected error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-background">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-icon">🔐</div>
            <h2 className="admin-login-title">Admin Portal</h2>
            <p className="admin-login-subtitle">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="admin-error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email" className="input-label">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@example.com"
                className="admin-input"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="admin-input"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Sign In as Admin'
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p className="admin-footer-text">
              Need admin access?{" "}
              <Link to="/admin/register" className="admin-link">
                Contact System Administrator
              </Link>
            </p>
            <div className="admin-security-note">
              <span className="security-icon">🔒</span>
              Secure admin access only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;