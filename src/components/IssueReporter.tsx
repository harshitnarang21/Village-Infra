import React, { useState } from "react";
import { saveOffline } from "../services/offlineSync";

const IssueReporter: React.FC = () => {
  const [report, setReport] = useState({ name: "", text: "", file: null as File | null });
  const [submittedIssues, setSubmittedIssues] = useState<{ name: string; text: string; file?: string }[]>([]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setReport({ ...report, [e.target.name]: e.target.value });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setReport({ ...report, file: e.target.files[0] });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedIssues([
      ...submittedIssues,
      { name: report.name, text: report.text, file: report.file ? report.file.name : undefined }
    ]);

    // Offline save
    saveOffline({
      key: "issue",
      data: { name: report.name, text: report.text, file: report.file && report.file.name, timestamp: Date.now() },
      url: "/api/issue"
    });
    
    setReport({ name: "", text: "", file: null });
  }

  return (
    <div style={{ margin: "2rem 0", border: "1px solid #e6f4fa", padding: "1.5rem", borderRadius: "8px" }}>
      <h2>Report Infrastructure Issue</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
        <input name="name" placeholder="Your Name (optional)" value={report.name} onChange={handleInput} />
        <textarea name="text" placeholder="Describe the issue..." rows={3} value={report.text} onChange={handleInput} />
        <input type="file" accept="image/*" onChange={handleFile} />
        <button type="submit" style={{ background: "#156ac9", color: "#fff", fontWeight: "bold", padding: ".6rem", borderRadius: "4px", marginTop: "8px" }}>
          Submit Issue
        </button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Recent Issues</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {submittedIssues.map((issue, idx) => (
          <li key={idx} style={{ margin: "1rem 0", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
            <b>{issue.name || "Anonymous"}</b>: {issue.text} <br/>
            {issue.file && <span>Attached: {issue.file}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueReporter;
