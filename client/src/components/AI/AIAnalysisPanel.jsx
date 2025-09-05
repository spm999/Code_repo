// // components/AIAnalysisPanel.jsx
// import { useState } from "react";
// import axios from "axios";

// const AIAnalysisPanel = ({ file, token, onClose }) => {
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleRunAnalysis = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       setAnalysis(null);

//       // Get full file details (to find latest version)
//       const fileRes = await axios.get(
//         `http://localhost:3000/api/code/files/${file._id}`,
//         // `https://code-repo-jrfq.onrender.com/api/code/files/${file._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const fullFile = fileRes.data.data;
//       const latestVersion = fullFile.versions[fullFile.versions.length - 1];

//       if (!latestVersion) {
//         setError("No version found for this file");
//         return;
//       }

//       // Run AI Analysis
//       const res = await axios.post(
//         // `https://code-repo-jrfq.onrender.com/api/ai/analyze/${latestVersion._id}`,
//         `http://localhost:3000/api/ai/analyze/${latestVersion._id}`,
        
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setAnalysis(res.data.data);
//     } catch (err) {
//       console.error("AI Analysis Error:", err);
//       setError("Failed to run AI analysis");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>AI Analysis - {file.title}</h3>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>
//         <div className="modal-body">
//           {loading && <p>Analyzing code with AI... ⏳</p>}
//           {error && <p className="error-message">{error}</p>}

//           {!loading && !analysis && (
//             <button className="approve-btn" onClick={handleRunAnalysis}>
//               Run AI Analysis
//             </button>
//           )}

//           {analysis && (
//             <div className="analysis-results">
//               <h4>Summary</h4>
//               <p>{analysis.summary}</p>

//               <h4>Complexity</h4>
//               <p>{analysis.complexity}</p>

//               <h4>Security Risks</h4>
//               {analysis.securityRisks?.length > 0 ? (
//                 <ul>
//                   {analysis.securityRisks.map((risk, idx) => (
//                     <li key={idx}>{risk}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>None detected</p>
//               )}

//               <h4>Optimization Suggestions</h4>
//               {analysis.optimizationSuggestions?.length > 0 ? (
//                 <ul>
//                   {analysis.optimizationSuggestions.map((opt, idx) => (
//                     <li key={idx}>{opt}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No suggestions</p>
//               )}

//               <h4>Best Practices</h4>
//               {analysis.bestPractices?.length > 0 ? (
//                 <ul>
//                   {analysis.bestPractices.map((bp, idx) => (
//                     <li key={idx}>{bp}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No best practices found</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         .analysis-results {
//           margin-top: 15px;
//           padding: 15px;
//           background: #f9f9f9;
//           border-radius: 6px;
//           border: 1px solid #e0e0e0;
//         }
//         .analysis-results h4 {
//           margin-bottom: 5px;
//           color: #333;
//         }
//         .analysis-results p, ul {
//           margin-bottom: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIAnalysisPanel;
// components/AIAnalysisPanel.jsx
import { useState } from "react";
import axios from "axios";

const AIAnalysisPanel = ({ versionId, fileTitle, token, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      // 🔥 Directly call AI analysis with versionId
      const res = await axios.post(
        // Production endpoint:
        `https://code-repo-jrfq.onrender.com/api/ai/analyze/${versionId}`,
        // `http://localhost:3000/api/ai/analyze/${versionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnalysis(res.data.data);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("Failed to run AI analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>AI Analysis - {fileTitle}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading && <p>Analyzing code with AI... ⏳</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !analysis && (
            <button className="approve-btn" onClick={handleRunAnalysis}>
              Run AI Analysis
            </button>
          )}

          {analysis && (
            <div className="analysis-results">
              <h4>Summary</h4>
              <p>{analysis.summary}</p>

              <h4>Complexity</h4>
              <p>{analysis.complexity}</p>

              <h4>Security Risks</h4>
              {analysis.securityRisks?.length > 0 ? (
                <ul>
                  {analysis.securityRisks.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              ) : (
                <p>None detected</p>
              )}

              <h4>Optimization Suggestions</h4>
              {analysis.optimizationSuggestions?.length > 0 ? (
                <ul>
                  {analysis.optimizationSuggestions.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
              ) : (
                <p>No suggestions</p>
              )}

              <h4>Best Practices</h4>
              {analysis.bestPractices?.length > 0 ? (
                <ul>
                  {analysis.bestPractices.map((bp, idx) => (
                    <li key={idx}>{bp}</li>
                  ))}
                </ul>
              ) : (
                <p>No best practices found</p>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .analysis-results {
          margin-top: 15px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }
        .analysis-results h4 {
          margin-bottom: 5px;
          color: #333;
        }
        .analysis-results p, ul {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default AIAnalysisPanel;
