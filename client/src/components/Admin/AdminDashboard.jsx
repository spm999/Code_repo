import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [codeFiles, setCodeFiles] = useState([]);
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const storedAdmin = JSON.parse(localStorage.getItem("adminData"));
        setAdmin(storedAdmin);

        // Fetch users
        const usersRes = await axios.get("http://localhost:3000/api/admins/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        // Fetch admins
        const adminsRes = await axios.get("http://localhost:3000/api/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(adminsRes.data);

        // Fetch code files
        const codeFilesRes = await axios.get("http://localhost:3000/api/code/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCodeFiles(codeFilesRes.data.data || codeFilesRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admins/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter((a) => a._id !== id));
      setSuccess("Admin deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete admin");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleApproveCode = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/code/files/${id}/admin-approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update the code file status in the UI
      setCodeFiles(codeFiles.map(file => 
        file._id === id ? {...file, status: "approved", pendingStatus: "none"} : file
      ));
      
      setSuccess("Code file approved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to approve code file");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleRejectCode = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/code/files/${id}/admin-reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update the code file status in the UI
      setCodeFiles(codeFiles.map(file => 
        file._id === id ? {...file, status: "rejected", pendingStatus: "none"} : file
      ));
      
      setSuccess("Code file rejected successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to reject code file");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteCode = async (id) => {
    if (!window.confirm("Are you sure you want to delete this code file?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/code/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCodeFiles(codeFiles.filter((file) => file._id !== id));
      setSuccess("Code file deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete code file");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const isSuperAdmin = admin.role === "superadmin";

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-welcome">
          <h1>Welcome, {admin.username}</h1>
          <span className="admin-role">{admin.role}</span>
          {isSuperAdmin && <span className="superadmin-badge">Super Admin</span>}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-content">
        <div className="admin-profile-card">
          <h3>Admin Profile</h3>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{admin.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{admin.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value admin-role-badge">{admin.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Permissions:</span>
              <span className="info-value">
                {isSuperAdmin ? "Full access" : "Limited access"}
              </span>
            </div>
          </div>
        </div>

        <div className="management-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users ({users.length})
            </button>
            <button 
              className={`tab ${activeTab === "admins" ? "active" : ""}`}
              onClick={() => setActiveTab("admins")}
            >
              Admins ({admins.length})
            </button>
            <button 
              className={`tab ${activeTab === "code" ? "active" : ""}`}
              onClick={() => setActiveTab("code")}
            >
              Code Files ({codeFiles.length})
            </button>
          </div>

          {activeTab === "users" && (
            <div className="users-section">
              <div className="section-header">
                <h3>User Management</h3>
                <span className="count-badge">Total: {users.length} users</span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.department || "N/A"}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="delete-btn"
                              title="Delete User"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {users.length === 0 && (
                  <div className="empty-state">
                    <p>No users found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "admins" && (
            <div className="admins-section">
              <div className="section-header">
                <h3>Admin Management</h3>
                <span className="count-badge">Total: {admins.length} admins</span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((adminUser) => (
                      <tr key={adminUser._id}>
                        <td>{adminUser.username}</td>
                        <td>{adminUser.email}</td>
                        <td>
                          <span className={`role-badge ${adminUser.role}`}>
                            {adminUser.role}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {isSuperAdmin && adminUser._id !== admin._id && (
                              <button
                                onClick={() => handleDeleteAdmin(adminUser._id)}
                                className="delete-btn"
                                title="Delete Admin"
                              >
                                🗑️ Delete
                              </button>
                            )}
                            {adminUser._id === admin._id && (
                              <span className="current-user">Current User</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {admins.length === 0 && (
                  <div className="empty-state">
                    <p>No admins found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="code-section">
              <div className="section-header">
                <h3>Code File Management</h3>
                <span className="count-badge">Total: {codeFiles.length} code files</span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Owner</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codeFiles.map((file) => (
                      <tr key={file._id}>
                        <td>{file.title}</td>
                        <td>{file.owner?.username || "Unknown"}</td>
                        <td>{file.language}</td>
                        <td>
                          <span className={`status-badge ${file.status}`}>
                            {file.status}
                          </span>
                        </td>
                        <td>{new Date(file.lastUpdated).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            {file.status === "submitted" && (
                              <>
                                <button
                                  onClick={() => handleApproveCode(file._id)}
                                  className="approve-btn"
                                  title="Approve Code"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() => handleRejectCode(file._id)}
                                  className="reject-btn"
                                  title="Reject Code"
                                >
                                  ✗ Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteCode(file._id)}
                              className="delete-btn"
                              title="Delete Code File"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {codeFiles.length === 0 && (
                  <div className="empty-state">
                    <p>No code files found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .admin-welcome h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        
        .admin-role, .superadmin-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 10px;
        }
        
        .admin-role {
          background-color: #e0e0e0;
          color: #333;
        }
        
        .superadmin-badge {
          background-color: #ffd700;
          color: #333;
          font-weight: bold;
        }
        
        .logout-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .logout-btn:hover {
          background-color: #d32f2f;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .admin-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
        }
        
        .admin-profile-card {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          height: fit-content;
        }
        
        .admin-profile-card h3 {
          margin-top: 0;
          color: #333;
        }
        
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
        }
        
        .info-label {
          font-weight: bold;
          color: #666;
        }
        
        .info-value {
          color: #333;
        }
        
        .admin-role-badge {
          background-color: #bbdefb;
          color: #0d47a1;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .management-section {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background-color: #f5f5f5;
        }
        
        .tab {
          padding: 12px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #666;
        }
        
        .tab.active {
          background-color: white;
          color: #333;
          border-bottom: 2px solid #2196f3;
        }
        
        .tab:hover {
          background-color: #eeeeee;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: #fafafa;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .section-header h3 {
          margin: 0;
          color: #333;
        }
        
        .count-badge {
          background-color: #e0e0e0;
          color: #333;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th,
        .data-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .data-table th {
          background-color: #f5f5f5;
          font-weight: 600;
          color: #333;
        }
        
        .role-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .role-badge.user {
          background-color: #e3f2fd;
          color: #1565c0;
        }
        
        .role-badge.admin {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .status-badge.submitted {
          background-color: #fff3e0;
          color: #ef6c00;
        }
        
        .status-badge.approved {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .status-badge.rejected {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .status-badge.draft {
          background-color: #f5f5f5;
          color: #616161;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .approve-btn, .reject-btn, .delete-btn {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .approve-btn {
          background-color: #4caf50;
          color: white;
        }
        
        .approve-btn:hover {
          background-color: #388e3c;
        }
        
        .reject-btn {
          background-color: #f44336;
          color: white;
        }
        
        .reject-btn:hover {
          background-color: #d32f2f;
        }
        
        .delete-btn {
          background-color: #f5f5f5;
          color: #333;
        }
        
        .delete-btn:hover {
          background-color: #e0e0e0;
        }
        
        .current-user {
          color: #666;
          font-style: italic;
        }
        
        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #666;
        }
        
        .loading-spinner-large {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2196f3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;