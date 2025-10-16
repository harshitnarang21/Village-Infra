import React from "react";

const Dashboard: React.FC = () => (
  <section className="dashboard-section">
    <div className="dashboard-card">
      <div className="card-title">IoT Devices Active</div>
      <div className="card-desc">3500 sensors connected and reporting data.</div>
    </div>
    <div className="dashboard-card">
      <div className="card-title">Asset Health</div>
      <div className="card-desc">92% of village assets are in good condition.</div>
    </div>
    <div className="dashboard-card">
      <div className="card-title">Budget Used</div>
      <div className="card-desc">₹10+ crore allocated via digital twin platform.</div>
    </div>
  </section>
);

export default Dashboard;
