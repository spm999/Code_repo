import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CodeFilesPage = () => {
  const [codeFiles, setCodeFiles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/files", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setCodeFiles(res.data.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Code Files</h1>
      <Link to="/create">Create New File</Link>
      <ul>
        {codeFiles.map(file => (
          <li key={file._id}>
            <Link to={`/files/${file._id}`}>
              {file.title} - Status: {file.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodeFilesPage;
