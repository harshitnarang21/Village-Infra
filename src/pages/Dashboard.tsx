import React from "react";
export default function Dashboard() {
  return (
    <div className="section">
      <h2 className="card-title">Dashboard</h2>
      <div style={{display:"flex",flexWrap:"wrap",gap:28}}>
        <div className="dashboard-card"><div className="dashboard-title">IoT Devices Active</div><div>3,500 currently online.</div></div>
        <div className="dashboard-card"><div className="dashboard-title">Asset Health</div><div>92% healthy status.</div></div>
        <div className="dashboard-card"><div className="dashboard-title">Budget Used</div><div>₹10 crore allocated</div></div>
        <div className="dashboard-card"><div className="dashboard-title">Efficiency Gains</div><div>30% cost saved.</div></div>
      </div>
    </div>
  );
}
