import React from "react";
export default function Features() {
  return (
    <div className="section">
      <h2 className="card-title">Key Features</h2>
      <div style={{display:"flex",flexWrap:"wrap",gap:28}}>
        <div className="card"><div className="card-title">Smart Asset Tracking</div><div>Real-time monitoring of water, electricity, and infrastructure assets.</div></div>
        <div className="card"><div className="card-title">Pred. Maintenance</div><div>AI-driven alerts before asset failures.</div></div>
        <div className="card"><div className="card-title">Citizen Engagement</div><div>Reporting and feedback for community.</div></div>
        <div className="card"><div className="card-title">Budget Insights</div><div>Transparent budgeting and spend tracking for all public works.</div></div>
      </div>
    </div>
  );
}
