import React from "react";
import { WrenchScrewdriverIcon, LinkIcon, HandThumbUpIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const features = [
  {
    title: "Predictive Maintenance",
    desc: "Smartly monitor assets and prevent failures",
    icon: <WrenchScrewdriverIcon className="h-9 w-9 text-blue-600" />
  },
  {
    title: "Blockchain Work Orders",
    desc: "Corruption-proof budgeting and tracking",
    icon: <LinkIcon className="h-9 w-9 text-blue-600" />
  },
  {
    title: "Citizen Voting",
    desc: "Participatory planning for the public",
    icon: <HandThumbUpIcon className="h-9 w-9 text-blue-600" />
  },
  {
    title: "Issue Reporting",
    desc: "Raise complaints, track fixes in real time",
    icon: <ExclamationTriangleIcon className="h-9 w-9 text-blue-600" />
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
