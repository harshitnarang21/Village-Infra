import React from "react";

export default function Analytics() {
  const stats = [
    { label: "Total Assets", value: "127", change: "+12% this month" },
    { label: "Active Issues", value: "23", change: "-5% this week" },
    { label: "Energy Saved", value: "45 kWh", change: "+18% this month" },
    { label: "Budget Utilization", value: "68%", change: "On track" }
  ];

  return (
    <div className="section">
      <h1 className="card-title">Analytics Dashboard</h1>
      
      <div className="stats-row">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div style={{fontSize:"0.85rem", color:"#4caf50", marginTop:"8px"}}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <h3 style={{color:"#48b6d2", marginBottom:"1rem"}}>Asset Health Over Time</h3>
        <div style={{height:"200px", display:"flex", alignItems:"center", justifyContent:"center", color:"#bccbe3"}}>
          [Chart Placeholder - Integrate Chart.js or Recharts here]
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-title">Top Performing Assets</div>
          <div>1. Solar Panel Array - 98% uptime</div>
          <div>2. Water Pump Station - 95% uptime</div>
          <div>3. Street Lights - 92% uptime</div>
        </div>
        <div className="card">
          <div className="card-title">Maintenance Schedule</div>
          <div>• Water Pump #1 - Oct 20</div>
          <div>• Solar Array - Oct 25</div>
          <div>• Street Lights - Nov 1</div>
        </div>
      </div>
    </div>
  );
}
