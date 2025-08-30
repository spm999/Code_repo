// // // src/pages/admin/AdminDashboard.jsx
// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import "../../assets/css/AdminDashboard.css"; // Import custom CSS

// // const AdminDashboard = () => {
// //   const [users, setUsers] = useState([]);
// //   const [admin, setAdmin] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem("adminToken");

// //   useEffect(() => {
// //     if (!token) {
// //       navigate("/admin/login");
// //       return;
// //     }

// //     const fetchAdminData = async () => {
// //       try {
// //         const storedAdmin = JSON.parse(localStorage.getItem("adminData"));
// //         setAdmin(storedAdmin);

// //         const res = await axios.get("http://localhost:3000/api/users", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setUsers(res.data);
// //       } catch (err) {
// //         console.error(err);
// //         setError("Failed to fetch data");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAdminData();
// //   }, [token, navigate]);

// //   const handleDeleteUser = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this user?")) return;
// //     try {
// //       await axios.delete(`http://localhost:3000/api/admins/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setUsers(users.filter((u) => u._id !== id));
// //       setSuccess("User deleted successfully");
// //       setTimeout(() => setSuccess(""), 3000);
// //     } catch (err) {
// //       console.error(err);
// //       setError("Failed to delete user");
// //       setTimeout(() => setError(""), 3000);
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("adminToken");
// //     localStorage.removeItem("adminData");
// //     navigate("/admin/login");
// //   };

// //   if (loading) {
// //     return (
// //       <div className="admin-container">
// //         <div className="loading-spinner-large"></div>
// //         <p>Loading dashboard...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="admin-container">
// //       <header className="admin-header">
// //         <div className="admin-welcome">
// //           <h1>Welcome, {admin.username}</h1>
// //           <span className="admin-role">{admin.role}</span>
// //         </div>
// //         <button onClick={handleLogout} className="logout-btn">
// //           Logout
// //         </button>
// //       </header>

// //       {error && <div className="error-message">{error}</div>}
// //       {success && <div className="success-message">{success}</div>}

// //       <div className="admin-content">
// //         <div className="admin-profile-card">
// //           <h3>Admin Profile</h3>
// //           <div className="profile-info">
// //             <div className="info-item">
// //               <span className="info-label">Username:</span>
// //               <span className="info-value">{admin.username}</span>
// //             </div>
// //             <div className="info-item">
// //               <span className="info-label">Email:</span>
// //               <span className="info-value">{admin.email}</span>
// //             </div>
// //             <div className="info-item">
// //               <span className="info-label">Role:</span>
// //               <span className="info-value admin-role-badge">{admin.role}</span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="users-section">
// //           <div className="section-header">
// //             <h3>User Management</h3>
// //             <span className="user-count">Total: {users.length} users</span>
// //           </div>

// //           <div className="users-table-container">
// //             <table className="users-table">
// //               <thead>
// //                 <tr>
// //                   <th>Username</th>
// //                   <th>Email</th>
// //                   <th>Role</th>
// //                   <th>Department</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {users.map((user) => (
// //                   <tr key={user._id}>
// //                     <td data-label="Username">{user.username}</td>
// //                     <td data-label="Email">{user.email}</td>
// //                     <td data-label="Role">
// //                       <span className={`role-badge ${user.role}`}>
// //                         {user.role}
// //                       </span>
// //                     </td>
// //                     <td data-label="Department">{user.department || "N/A"}</td>
// //                     <td data-label="Actions">
// //                       <button
// //                         onClick={() => handleDeleteUser(user._id)}
// //                         className="delete-btn"
// //                         title="Delete User"
// //                       >
// //                         🗑️ Delete
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
            
// //             {users.length === 0 && (
// //               <div className="empty-state">
// //                 <p>No users found</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;


// // src/pages/admin/AdminDashboard.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../../assets/css/AdminDashboard.css";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [admin, setAdmin] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [activeTab, setActiveTab] = useState("users");
//   const navigate = useNavigate();
//   const token = localStorage.getItem("adminToken");

//   useEffect(() => {
//     if (!token) {
//       navigate("/admin/login");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const storedAdmin = JSON.parse(localStorage.getItem("adminData"));
//         setAdmin(storedAdmin);

//         // Fetch users
//         const usersRes = await axios.get("http://localhost:3000/api/admins/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(usersRes.data);

//         // Fetch admins
//         const adminsRes = await axios.get("http://localhost:3000/api/admins", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAdmins(adminsRes.data);

//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token, navigate]);

//   const handleDeleteUser = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await axios.delete(`http://localhost:3000/api/admins/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(users.filter((u) => u._id !== id));
//       setSuccess("User deleted successfully");
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete user");
//       setTimeout(() => setError(""), 3000);
//     }
//   };

//   const handleDeleteAdmin = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this admin?")) return;
//     try {
//       await axios.delete(`http://localhost:3000/api/admins/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAdmins(admins.filter((a) => a._id !== id));
//       setSuccess("Admin deleted successfully");
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete admin");
//       setTimeout(() => setError(""), 3000);
//     }
//   };


//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminData");
//     navigate("/admin/login");
//   };

//   const isSuperAdmin = admin.role === "superadmin";

//   if (loading) {
//     return (
//       <div className="admin-container">
//         <div className="loading-spinner-large"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-container">
//       <header className="admin-header">
//         <div className="admin-welcome">
//           <h1>Welcome, {admin.username}</h1>
//           <span className="admin-role">{admin.role}</span>
//           {isSuperAdmin && <span className="superadmin-badge">Super Admin</span>}
//         </div>
//         {/* <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button> */}
//       </header>

//       {error && <div className="error-message">{error}</div>}
//       {success && <div className="success-message">{success}</div>}

//       <div className="admin-content">
//         <div className="admin-profile-card">
//           <h3>Admin Profile</h3>
//           <div className="profile-info">
//             <div className="info-item">
//               <span className="info-label">Username:</span>
//               <span className="info-value">{admin.username}</span>
//             </div>
//             <div className="info-item">
//               <span className="info-label">Email:</span>
//               <span className="info-value">{admin.email}</span>
//             </div>
//             <div className="info-item">
//               <span className="info-label">Role:</span>
//               <span className="info-value admin-role-badge">{admin.role}</span>
//             </div>
//             <div className="info-item">
//               <span className="info-label">Permissions:</span>
//               <span className="info-value">
//                 {isSuperAdmin ? "Full access" : "Limited access"}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="management-section">
//           <div className="tabs">
//             <button 
//               className={`tab ${activeTab === "users" ? "active" : ""}`}
//               onClick={() => setActiveTab("users")}
//             >
//               Users ({users.length})
//             </button>
//             <button 
//               className={`tab ${activeTab === "admins" ? "active" : ""}`}
//               onClick={() => setActiveTab("admins")}
//             >
//               Admins ({admins.length})
//             </button>
//           </div>

//           {activeTab === "users" && (
//             <div className="users-section">
//               <div className="section-header">
//                 <h3>User Management</h3>
//                 <span className="count-badge">Total: {users.length} users</span>
//               </div>

//               <div className="table-container">
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Username</th>
//                       <th>Email</th>
//                       <th>Role</th>
//                       <th>Department</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.map((user) => (
//                       <tr key={user._id}>
//                         <td>{user.username}</td>
//                         <td>{user.email}</td>
//                         <td>
//                           <span className={`role-badge ${user.role}`}>
//                             {user.role}
//                           </span>
//                         </td>
//                         <td>{user.department || "N/A"}</td>
//                         <td>
//                           <div className="action-buttons">
//                             <button
//                               onClick={() => handleDeleteUser(user._id)}
//                               className="delete-btn"
//                               title="Delete User"
//                             >
//                               🗑️ Delete
//                             </button>
//                             {isSuperAdmin && (
//                               <button
//                                 onClick={() => handlePromoteToAdmin(user._id)}
//                                 className="promote-btn"
//                                 title="Promote to Admin"
//                               >
//                                 ⬆️ Promote
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
                
//                 {users.length === 0 && (
//                   <div className="empty-state">
//                     <p>No users found</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === "admins" && (
//             <div className="admins-section">
//               <div className="section-header">
//                 <h3>Admin Management</h3>
//                 <span className="count-badge">Total: {admins.length} admins</span>
//               </div>

//               <div className="table-container">
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Username</th>
//                       <th>Email</th>
//                       <th>Role</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {admins.map((adminUser) => (
//                       <tr key={adminUser._id}>
//                         <td>{adminUser.username}</td>
//                         <td>{adminUser.email}</td>
//                         <td>
//                           <span className={`role-badge ${adminUser.role}`}>
//                             {adminUser.role}
//                           </span>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             {isSuperAdmin && adminUser._id !== admin._id && (
//                               <button
//                                 onClick={() => handleDeleteAdmin(adminUser._id)}
//                                 className="delete-btn"
//                                 title="Delete Admin"
//                               >
//                                 🗑️ Delete
//                               </button>
//                             )}
//                             {adminUser._id === admin._id && (
//                               <span className="current-user">Current User</span>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
                
//                 {admins.length === 0 && (
//                   <div className="empty-state">
//                     <p>No admins found</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; // shadcn button
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:3000/api/code"; // adjust if needed

const AdminDashboard = () => {
  const [submittedFiles, setSubmittedFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all submitted code files
  const fetchSubmittedFiles = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(`${API_URL}/submitted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmittedFiles(data);
    } catch (error) {
      console.error("Error fetching submitted files:", error);
      toast.error("Failed to load submitted files");
    }
  };

  // Fetch all code files
  const fetchAllFiles = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(`${API_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllFiles(data);
    } catch (error) {
      console.error("Error fetching all files:", error);
      toast.error("Failed to load all files");
    }
  };

  // Approve file
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${API_URL}/files/${id}/admin-approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Code approved successfully!");
      fetchSubmittedFiles();
      fetchAllFiles();
    } catch (error) {
      console.error("Error approving file:", error);
      toast.error("Failed to approve file");
    }
  };

  // Reject file
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${API_URL}/files/${id}/admin-reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Code rejected!");
      fetchSubmittedFiles();
      fetchAllFiles();
    } catch (error) {
      console.error("Error rejecting file:", error);
      toast.error("Failed to reject file");
    }
  };

  // Delete file
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("File deleted successfully!");
      fetchAllFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSubmittedFiles(), fetchAllFiles()]).finally(() =>
      setLoading(false)
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Submitted Files Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Submitted Files</h2>
        {loading ? (
          <p>Loading...</p>
        ) : submittedFiles.length === 0 ? (
          <p>No submitted files</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submittedFiles.map((file) => (
              <Card key={file._id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{file.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Status: {file.status}
                  </p>
                </CardHeader>
                <CardContent>
                  <p>{file.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleApprove(file._id)}
                      className="bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(file._id)}
                      className="bg-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* All Files Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Code Files</h2>
        {loading ? (
          <p>Loading...</p>
        ) : allFiles.length === 0 ? (
          <p>No files found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allFiles.map((file) => (
              <Card key={file._id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{file.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Status: {file.status}
                  </p>
                </CardHeader>
                <CardContent>
                  <p>{file.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
