import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const navigate = useNavigate();

  // ✅ Consistent token handling
  // const token = localStorage.getItem("token");
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  const isAuthenticated = () => !!token;

  const handleLogout = () => {
    // ✅ Clear all auth data
    localStorage.removeItem("token")||localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");

    // ✅ Redirect based on role
    if (admin) {
      navigate("/admin/login");
    } else {
      navigate("/");
    }
  };

  return (
    <header id="main-header">
      <nav id="header-nav">
        <div id="nav-container">
          {/* Logo */}
          <Link to="/" id="logo-container">
            <div id="logo-icon">
              <span>CR</span>
            </div>
            <span id="logo-text">CodeRepository</span>
          </Link>

          {/* Navigation Links */}
          <div id="nav-links">
            {isAuthenticated() && (
              <>
                {user && (
                  <>
                    <Link to="/profile" className="nav-link">
                      Dashboard
                    </Link>
                    <Link to="/code" className="nav-link">
                      My Code
                    </Link>
                  </>
                )}
                {admin && (
                  <>
                    <Link to="/admin/dashboard" className="nav-link">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/users" className="nav-link">
                      Users
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Auth Section */}
          <div id="auth-section">
            {isAuthenticated() ? (
              <div id="user-info">
                <div id="user-details">
                  <UserIcon className="icon" />
                  <span id="username">{user?.username || admin?.username}</span>
                  <span id="user-role">{user ? "User" : admin?.role}</span>
                </div>

                {user && (
                  <Link to="/profile" className="icon-link">
                    <CogIcon className="icon" />
                  </Link>
                )}

                <button onClick={handleLogout} id="logout-btn">
                  <ArrowRightOnRectangleIcon className="icon" />
                  <span id="logout-text">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
                <Link to="/register" id="signup-btn">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>


      <style jsx>{`
        /* Header Styles */
        #main-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          padding: 15px 0;
          border-bottom: 1px solid #e5e7eb;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        #header-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        #nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4rem;
        }
        
        /* Logo */
        #logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        
        #logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }
        
        #logo-text {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        /* Navigation Links */
        #nav-links {
          display: flex;
          gap: 25px;
          align-items: center;
        }
        
        .nav-link {
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
          font-size: 0.95rem;
        }
        
        .nav-link:hover {
          color: #4f46e5;
        }
        
        /* Auth Section */
        #auth-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        #user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        #user-details {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .icon {
          width: 20px;
          height: 20px;
          color: #4b5563;
        }
        
        #username {
          font-size: 0.875rem;
          color: #374151;
        }
        
        #user-role {
          font-size: 0.75rem;
          background-color: #dbeafe;
          color: #1e40af;
          padding: 4px 8px;
          border-radius: 9999px;
        }
        
        .icon-link {
          color: #4b5563;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .icon-link:hover {
          color: #4f46e5;
        }
        
        #logout-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #4b5563;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          transition: color 0.3s;
        }
        
        #logout-btn:hover {
          color: #dc2626;
        }
        
        #logout-text {
          display: none;
        }
        
        #signup-btn {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        #signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
        }
        
        /* Responsive Design */
        @media (min-width: 640px) {
          #logout-text {
            display: inline;
          }
        }
        
        @media (max-width: 768px) {
          #nav-links {
            display: none;
          }
          
          #user-details span:not(:first-child) {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          #auth-section {
            gap: 10px;
          }
          
          #user-info {
            gap: 10px;
          }
          
          #signup-btn {
            padding: 8px 16px;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
