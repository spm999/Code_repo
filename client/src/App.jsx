
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// User Pages
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Profile from "./components/User/Profile";

// Admin Pages
import AdminLogin from "./components/Admin/AdminLogin";
import AdminRegister from "./components/Admin/AdminRegister";
import AdminDashboard from "./components/Admin/AdminDashboard";

// Layout
import Home from "./Home";
import Header from "./components/Layout/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* User Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected */}
        <Route path="/profile" element={<Profile />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Protected */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route
          path="*"
          element={<h1 className="text-center mt-10">404 Page Not Found</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;


