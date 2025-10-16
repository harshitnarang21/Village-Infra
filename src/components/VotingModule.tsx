import React, { useState } from "react";
import { saveOffline } from "../services/offlineSync";

const projects = [
  { id: "P101", title: "Repair Main Road", description: "Fix potholes and drainage issues", votes: 7 },
  { id: "P102", title: "New Water Tank", description: "Build overhead tank for drinking water", votes: 13 },
  { id: "P103", title: "Solar Street Lights", description: "Upgrade to solar-powered lighting", votes: 22 }
];

const VotingModule: React.FC = () => {
  const [votes, setVotes] = useState(projects.map(p => p.votes));
  const [hasVoted, setHasVoted] = useState(Array(projects.length).fill(false));
  
  const handleVote = (idx: number) => {
    if (hasVoted[idx]) return;
    const newVotes = [...votes];
    const newHasVoted = [...hasVoted];
    newVotes[idx]++;
    newHasVoted[idx] = true;
    setVotes(newVotes);
    setHasVoted(newHasVoted);

    // Save vote if offline
    saveOffline({
      key: "vote",
      data: { projectId: projects[idx].id, timestamp: Date.now() },
      url: "/api/vote"
    });
  };

  return (
    <div style={{ margin: "2rem 0", border: "1px solid #faf7e6", padding: "1.5rem", borderRadius: "8px" }}>
      <h2>Vote for Upcoming Projects</h2>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {projects.map((p, idx) => (
          <li key={p.id} style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #eee", borderRadius: "7px" }}>
            <b>{p.title}</b> - {p.description} <br />
            <span>Votes: {votes[idx]}</span><br />
            <button 
              disabled={hasVoted[idx]}
              style={{
                background: hasVoted[idx] ? "#d7d7d7" : "#406add",
                color: "#fff", marginTop: "8px", padding: ".5rem 1.2rem", borderRadius: "4px", fontWeight: "bold"
              }}
              onClick={() => handleVote(idx)}
            >
              {hasVoted[idx] ? "Voted" : "Vote"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingModule;
