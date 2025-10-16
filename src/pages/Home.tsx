import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  
  return (
    <div className="section">
      <div style={{textAlign:"center", maxWidth:"800px", margin:"0 auto 64px auto"}}>
        <h1 className="page-title" style={{fontSize:"3rem", marginBottom:"24px"}}>
          Complete Vision for<br/>Village Infrastructure
        </h1>
        <p className="page-subtitle" style={{fontSize:"1.25rem", marginBottom:"32px"}}>
          Sudarshan brings transparency, efficiency, and modern technology to rural infrastructure management through digital twins, IoT monitoring, and blockchain verification.
        </p>
        <div style={{display:"flex", gap:"16px", justifyContent:"center"}}>
          <button className="button-primary" onClick={() => nav("/dashboard")}>
            Get Started
          </button>
          <button className="button-secondary" onClick={() => nav("/map")}>
            View Live Map
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">120+</div>
          <div className="stat-label">Villages Upgraded</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">3,500+</div>
          <div className="stat-label">IoT Devices Deployed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Citizens Empowered</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹10Cr+</div>
          <div className="stat-label">Budget Managed</div>
        </div>
      </div>

      <div style={{marginTop:"64px"}}>
        <h2 className="page-title" style={{fontSize:"2rem", textAlign:"center", marginBottom:"40px"}}>
          Why Choose Sudarshan?
        </h2>
        <div className="grid">
          <div className="card">
            <div className="card-title">🎯 Complete Visibility</div>
            <div className="card-content">Real-time digital twin technology provides 360° visibility of all village infrastructure assets and their health status.</div>
          </div>
          <div className="card">
            <div className="card-title">🔒 Blockchain Verified</div>
            <div className="card-content">Every transaction and work order is recorded on blockchain for complete transparency and accountability.</div>
          </div>
          <div className="card">
            <div className="card-title">📊 Data-Driven Insights</div>
            <div className="card-content">Advanced analytics and AI-powered predictions help optimize resource allocation and maintenance scheduling.</div>
          </div>
          <div className="card">
            <div className="card-title">🌱 Sustainable Growth</div>
            <div className="card-content">Monitor energy consumption, water usage, and environmental impact for sustainable village development.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
