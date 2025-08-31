import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/Register.css"; // Import custom CSS

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "developer",
    department: "IT",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/users/register", formData);
      setSuccess("Registration successful! Redirecting to login...");
      setError(""); // Clear any previous errors

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess(""); // Clear success if error occurs
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="form-title">Register</h2>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-input"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-input"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-input"
          onChange={handleChange}
          required
        />

        <select
          name="department"
          className="form-input"
          onChange={handleChange}
          value={formData.department}
        >
          <option value="IT">IT</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Compliance">Compliance</option>
          <option value="Operations">Operations</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="role"
          className="form-input"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="developer">Developer</option>
          <option value="reviewer">Reviewer</option>

        </select>

        <button type="submit" className="form-button">
          Register
        </button>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="form-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

