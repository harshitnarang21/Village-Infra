import React, { useState } from "react";

type Report = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  date: string;
  reporter: string;
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([
    { id: 1, title: "Broken Street Light", description: "Street light not working near temple", category: "Lighting", status: "pending", date: "2025-10-14", reporter: "Ram Kumar" },
    { id: 2, title: "Water Leakage", description: "Pipe leaking at main road junction", category: "Water", status: "in-progress", date: "2025-10-15", reporter: "Sita Devi" }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", category: "" });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      id: reports.length + 1,
      ...formData,
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      reporter: "Current User"
    };
    setReports([newReport, ...reports]);
    setFormData({ title: "", description: "", category: "" });
    setShowModal(false);
  };

  return (
    <div className="section">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem"}}>
        <h1 className="card-title">Issue Reports</h1>
        <button className="button-primary" onClick={() => setShowModal(true)}>+ Report Issue</button>
      </div>

      <div className="grid">
        {reports.map(report => (
          <div className="card" key={report.id}>
            <div className="card-title">{report.title}</div>
            <div style={{fontSize:"0.9rem", color:"#bccbe3", marginBottom:"8px"}}>{report.date} • {report.reporter}</div>
            <div style={{marginBottom:"12px"}}>{report.description}</div>
            <div><strong>Category:</strong> {report.category}</div>
            <div><strong>Status:</strong> <span className={`status-badge status-${report.status}`}>{report.status}</span></div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{color:"#48b6d2", marginBottom:"1.5rem"}}>Report New Issue</h2>
            <form onSubmit={handleSubmitReport}>
              <input
                placeholder="Issue Title"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={4}
                required
              />
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Water">Water</option>
                <option value="Energy">Energy</option>
                <option value="Lighting">Lighting</option>
                <option value="Road">Road</option>
                <option value="Other">Other</option>
              </select>
              <button className="form-btn" type="submit">Submit Report</button>
              <button className="button-secondary" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
