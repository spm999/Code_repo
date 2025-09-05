import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CodeFileDetailPage = () => {
  const { id } = useParams();
  const [codeFile, setCodeFile] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(`https://code-repo-jrfq.onrender.com/api/files/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setCodeFile(res.data.data))
    .catch(err => console.error(err));
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("codeFile", file);
    try {
      await axios.post(`https://code-repo-jrfq.onrender.com/api/files/${id}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert("Version uploaded successfully");
    } catch (error) {
      console.error(error);
    }
  };

  if (!codeFile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{codeFile.title}</h1>
      <p>{codeFile.description}</p>
      <p>Status: {codeFile.status}</p>
      <p>Last Updated By: {codeFile.lastUpdatedBy?.username}</p>
      
      <h3>Versions:</h3>
      <ul>
        {codeFile.versions.map(v => (
          <li key={v._id}>
            Version {v.versionNumber} - Uploaded by: {v.uploadedBy?.username}
            <a href={v.fileUrl} target="_blank" rel="noopener noreferrer">Download</a>
          </li>
        ))}
      </ul>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={e => setFile(e.target.files[0])} required />
        <button type="submit">Upload New Version</button>
      </form>
    </div>
  );
};

export default CodeFileDetailPage;
