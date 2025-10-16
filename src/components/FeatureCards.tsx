import React from "react";
import { FaTools, FaLink, FaVoteYea, FaExclamationTriangle } from "react-icons/fa";

const features = [
  {
    title: "Predictive Maintenance",
    desc: "Smartly monitor assets and prevent failures",
    icon: <FaTools size={36} color="#4b6cec" />
  },
  {
    title: "Blockchain Work Orders",
    desc: "Corruption-proof budgeting and tracking",
    icon: <FaLink size={36} color="#4b6cec" />
  },
  {
    title: "Citizen Voting",
    desc: "Participatory planning for the public",
    icon: <FaVoteYea size={36} color="#4b6cec" />
  },
  {
    title: "Issue Reporting",
    desc: "Raise complaints, track fixes in real time",
    icon: <FaExclamationTriangle size={36} color="#4b6cec" />
  }
];

const FeatureCards: React.FC = () => (
  <div className="feature-section">
    {features.map((f, idx) => (
      <div key={idx} className="card">
        <div style={{ marginBottom: "1rem" }}>{f.icon}</div>
        <div className="card-title">{f.title}</div>
        <div className="card-desc">{f.desc}</div>
      </div>
    ))}
  </div>
);

export default FeatureCards;
