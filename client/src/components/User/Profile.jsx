import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [codeFiles, setCodeFiles] = useState([]);
  const [allApprovedFiles, setAllApprovedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [approvedFilesLoading, setApprovedFilesLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditCodeModal, setShowEditCodeModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewFileContent, setViewFileContent] = useState("");
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    tags: "",
    language: "javascript",
    codeContent: ""
  });
  const [uploadFile, setUploadFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (activeTab === "myFiles") {
      fetchUserCodeFiles();
    } else if (activeTab === "allFiles") {
      fetchAllApprovedFiles();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        department: res.data.department || "IT",
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const fetchUserCodeFiles = async () => {
    try {
      setFilesLoading(true);
      const res = await axios.get("http://localhost:3000/api/code/user/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCodeFiles(res.data.data || []);
    } catch (err) {
      console.error("Error fetching code files:", err);
      setError("Failed to fetch code files");
    } finally {
      setFilesLoading(false);
    }
  };

  const fetchAllApprovedFiles = async () => {
    try {
      setApprovedFilesLoading(true);
      const res = await axios.get("http://localhost:3000/api/code/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approvedFiles = (res.data.data || []).filter(file => file.status === "approved");
      setAllApprovedFiles(approvedFiles);
    } catch (err) {
      console.error("Error fetching approved files:", err);
      setError("Failed to fetch approved files");
    } finally {
      setApprovedFilesLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadChange = (e) => {
    setUploadData({ ...uploadData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setSuccess("Profile updated successfully!");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed");
      setSuccess("");
    }
  };

  const handleCreateFile = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", uploadData.title);
      formDataToSend.append("description", uploadData.description);
      formDataToSend.append("tags", uploadData.tags);
      formDataToSend.append("language", uploadData.language);

      if (uploadFile) {
        formDataToSend.append("codeFile", uploadFile);
      } else if (uploadData.codeContent) {
        formDataToSend.append("codeContent", uploadData.codeContent);
      }

      await axios.post("http://localhost:3000/api/code/files", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Code file created successfully!");
      setShowCreateModal(false);
      setUploadData({
        title: "",
        description: "",
        tags: "",
        language: "javascript",
        codeContent: ""
      });
      setUploadFile(null);
      fetchUserCodeFiles();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to create code file");
    }
  };

  const handleUpdateFile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/code/files/${selectedFile._id}`, {
        title: uploadData.title,
        description: uploadData.description,
        tags: uploadData.tags,
        language: uploadData.language,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Code file updated successfully!");
      setShowEditModal(false);
      fetchUserCodeFiles();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update code file");
    }
  };

  const handleUploadVersion = async (e) => {
    e.preventDefault();
    try {
      const versionFormData = new FormData();
      versionFormData.append("codeFile", uploadFile);

      await axios.post(`http://localhost:3000/api/code/files/${selectedFile._id}/upload`, versionFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("New version uploaded successfully!");
      setShowUploadModal(false);
      setUploadFile(null);
      fetchUserCodeFiles();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to upload new version");
    }
  };

  const handleViewFile = async (file) => {
    try {
      setIsLoadingContent(true);
      setSelectedFile(file);

      const fileRes = await axios.get(`http://localhost:3000/api/code/files/${file._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fullFile = fileRes.data.data;
      const latestVersion = fullFile.versions[fullFile.versions.length - 1];

      if (latestVersion && latestVersion.fileUrl) {
        const contentRes = await axios.get(latestVersion.fileUrl, {
          responseType: 'text'
        });
        setViewFileContent(contentRes.data);
      } else {
        setViewFileContent("No content available");
      }

      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching file content:", err);
      setViewFileContent("Error loading file content");
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedFile(null);
    setViewFileContent("");
  };

  const openEditModal = (file) => {
    setSelectedFile(file);
    setUploadData({
      title: file.title,
      description: file.description,
      tags: file.tags.join(","),
      language: file.language,
      codeContent: ""
    });
    setShowEditModal(true);
  };

  const openUploadModal = (file) => {
    setSelectedFile(file);
    setShowUploadModal(true);
  };

  const handleUpdateCodeContent = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/code/files/${selectedFile._id}/content`,
        { codeContent: uploadData.codeContent }
      );
      setSuccess("Code updated successfully!");
      fetchUserCodeFiles(); // refresh list
      setShowEditCodeModal(false);
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error(err);
      setError("Failed to update code content");
    }
  };


  const openEditCodeModal = (file) => {
    setSelectedFile(file);

    // If you store editable content in codeContent field
    setUploadData({
      ...uploadData,
      codeContent: file.codeContent || ""  // <-- use existing content
    });

    setShowEditCodeModal(true);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      submitted: "status-submitted",
      approved: "status-approved",
      rejected: "status-rejected",
      draft: "status-draft",
    };
    return (
      <span className={`status-badge ${statusColors[status] || "status-draft"}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderCodeFilesTable = (files, isLoading, showActions = true) => {
    if (isLoading) return <p className="center-text">Loading files...</p>;
    if (files.length === 0) return <p className="center-text">No files found.</p>;

    return (
      <div className="code-files-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Language</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Last Updated</th>
              <th>Owner</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td>
                  <button
                    className="file-title-btn"
                    onClick={() => handleViewFile(file)}
                    title="View file content"
                  >
                    <div className="file-title">{file.title}</div>
                  </button>
                  <div className="file-description">{file.description}</div>
                </td>
                <td>
                  <span className="language-badge">{file.language}</span>
                </td>
                <td>{getStatusBadge(file.status)}</td>
                <td>
                  <div className="tags-container">
                    {file.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{formatDate(file.lastUpdated)}</td>
                <td>{file.owner?.username || "Unknown"}</td>
                <td>
                  {file.verifiedBy ? file.verifiedBy.username : "Not reviewed"}
                </td>
                {showActions && (
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(file)}
                        className="edit-btn"
                        title="Edit File"
                      >
                        Edit CodeFile Details
                      </button>
                      {/* <button
                        onClick={() => openEditCodeModal(file)}
                        className="edit-code-btn"
                        title="Edit Code Content"
                      >
                        Edit Code
                      </button> */}
                      {file.status === "rejected" && (
                        <button
                          onClick={() => openUploadModal(file)}
                          className="upload-btn"
                          title="Upload New Version"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <p className="center-text">Loading profile...</p>;

  return (
    <div className="profile-container">
      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          User Profile
        </button>
        <button
          className={`tab-button ${activeTab === "myFiles" ? "active" : ""}`}
          onClick={() => setActiveTab("myFiles")}
        >
          My Code Files
        </button>
        <button
          className={`tab-button ${activeTab === "allFiles" ? "active" : ""}`}
          onClick={() => setActiveTab("allFiles")}
        >
          All Approved Files
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="profile-card">
          <h2 className="profile-title">Profile</h2>
          <form onSubmit={handleUpdate} className="profile-form">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              className="form-input"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="form-input"
              required
            />

            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="developer">Developer</option>
              <option value="reviewer">Reviewer</option>
              <option value="viewer">Viewer</option>
            </select>

            <label>Department</label>
            <select
              name="department"
              value={formData.department || "IT"}
              onChange={handleChange}
              className="form-input"
            >
              <option value="IT">IT</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Compliance">Compliance</option>
              <option value="Operations">Operations</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit" className="form-button">
              Update Profile
            </button>
          </form>
        </div>
      )}

      {/* My Code Files Tab */}
      {activeTab === "myFiles" && (
        <div className="profile-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="profile-title">My Code Files</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="create-file-btn"
            >
              + Create New File
            </button>
          </div>
          {renderCodeFilesTable(codeFiles, filesLoading, true)}
        </div>
      )}

      {/* All Approved Files Tab */}
      {activeTab === "allFiles" && (
        <div className="profile-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="profile-title">All Approved Code Files</h2>
            <span className="files-count">{allApprovedFiles.length} approved files</span>
          </div>
          {renderCodeFilesTable(allApprovedFiles, approvedFilesLoading, false)}
        </div>
      )}

      {/* Create File Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Code File</h3>
            <form onSubmit={handleCreateFile}>
              <input
                type="text"
                name="title"
                placeholder="Title *"
                value={uploadData.title}
                onChange={handleUploadChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description *"
                value={uploadData.description}
                onChange={handleUploadChange}
                rows="3"
                required
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma-separated) *"
                value={uploadData.tags}
                onChange={handleUploadChange}
                required
              />
              <select
                name="language"
                value={uploadData.language}
                onChange={handleUploadChange}
                required
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="other">Other</option>
              </select>

              <input
                type="file"
                onChange={handleFileChange}
                accept=".js,.py,.java,.cpp,.txt,.c,.html,.css"
                required
              />

              <div className="modal-actions">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Code File Details</h3>
            <form onSubmit={handleUpdateFile}>
              <input
                type="text"
                name="title"
                placeholder="Title *"
                value={uploadData.title}
                onChange={handleUploadChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description *"
                value={uploadData.description}
                onChange={handleUploadChange}
                rows="3"
                required
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma-separated) *"
                value={uploadData.tags}
                onChange={handleUploadChange}
                required
              />
              <select
                name="language"
                value={uploadData.language}
                onChange={handleUploadChange}
                required
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="other">Other</option>
              </select>
              <div className="modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Version Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Upload New Version</h3>
            <form onSubmit={handleUploadVersion}>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".js,.py,.java,.cpp,.txt,.c,.html,.css"
                required
              />
              <div className="modal-actions">
                <button type="submit">Upload</button>
                <button type="button" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View File Modal */}
      {showViewModal && (
        <div className="modal-overlay" onClick={handleCloseViewModal}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedFile?.title}</h3>
              <button className="modal-close" onClick={handleCloseViewModal}>×</button>
            </div>
            <div className="modal-body">
              {isLoadingContent ? (
                <div className="loading-spinner">Loading content...</div>
              ) : (
                <div className="code-content">
                  <pre>{viewFileContent}</pre>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <div className="file-info">
                <span>Language: {selectedFile?.language}</span>
                <span>Status: {selectedFile?.status}</span>
                <span>Owner: {selectedFile?.owner?.username}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Code Content Modal */}
      {showEditCodeModal && (
        <div className="modal-overlay">
          <div className="modal-content edit-code-modal">
            <h3>Edit Code Content</h3>
            <form onSubmit={handleUpdateCodeContent}>
              <textarea
                className="code-editor"
                value={uploadData.codeContent}
                onChange={(e) => setUploadData({ ...uploadData, codeContent: e.target.value })}
                placeholder="Enter your code here..."
                required
              />
              <div className="modal-actions">
                <button type="submit">Update Code</button>
                <button type="button" onClick={() => setShowEditCodeModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

