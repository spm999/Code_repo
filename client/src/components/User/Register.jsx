// // src/pages/Register.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "developer",
//     department: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:3000/api/users/register", formData);
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-96">
//         <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           className="w-full p-2 mb-3 border rounded-lg"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="w-full p-2 mb-3 border rounded-lg"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="w-full p-2 mb-3 border rounded-lg"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="department"
//           placeholder="Department"
//           className="w-full p-2 mb-3 border rounded-lg"
//           onChange={handleChange}
//         />
//         <select
//           name="role"
//           className="w-full p-2 mb-3 border rounded-lg"
//           onChange={handleChange}
//           value={formData.role}
//         >
//           <option value="developer">Developer</option>
//           <option value="reviewer">Reviewer</option>
//           <option value="viewer">Viewer</option>
//         </select>

//         <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
//           Register
//         </button>

//         <p className="mt-4 text-sm text-center">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;


// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import "../../assets/css/Register.css"; // Import custom CSS

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "developer",
//     department: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:3000/api/users/register", formData);
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="register-container">
//       <form onSubmit={handleSubmit} className="register-form">
//         <h2 className="form-title">Register</h2>

//         {error && <p className="error-text">{error}</p>}

//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           className="form-input"
//           onChange={handleChange}
//           required
//         />
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
//         <input
//           type="text"
//           name="department"
//           placeholder="Department"
//           className="form-input"
//           onChange={handleChange}
//         />
//         <select
//           name="role"
//           className="form-input"
//           onChange={handleChange}
//           value={formData.role}
//         >
//           <option value="developer">Developer</option>
//           <option value="reviewer">Reviewer</option>
//           <option value="viewer">Viewer</option>
//         </select>

//         <button type="submit" className="form-button">
//           Register
//         </button>

//         <p className="form-footer">
//           Already have an account?{" "}
//           <Link to="/login" className="form-link">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;


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

