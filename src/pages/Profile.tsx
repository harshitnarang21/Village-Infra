import React, { useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@villageinfra.com",
    role: "Administrator",
    village: "Sample Village"
  });

  return (
    <div className="section">
      <h1 className="card-title">User Profile</h1>
      
      <div className="card" style={{maxWidth:"600px"}}>
        <div className="card-title">Profile Information</div>
        <div style={{marginBottom:"1rem"}}>
          <strong>Name:</strong> {profile.name}
        </div>
        <div style={{marginBottom:"1rem"}}>
          <strong>Email:</strong> {profile.email}
        </div>
        <div style={{marginBottom:"1rem"}}>
          <strong>Role:</strong> {profile.role}
        </div>
        <div style={{marginBottom:"1rem"}}>
          <strong>Village:</strong> {profile.village}
        </div>
        <button className="button-primary">Edit Profile</button>
      </div>

      <div className="card" style={{maxWidth:"600px", marginTop:"2rem"}}>
        <div className="card-title">Settings</div>
        <div style={{marginBottom:"1rem"}}>
          <label>
            <input type="checkbox" /> Enable email notifications
          </label>
        </div>
        <div style={{marginBottom:"1rem"}}>
          <label>
            <input type="checkbox" /> Dark mode
          </label>
        </div>
        <button className="button-primary">Save Settings</button>
      </div>
    </div>
  );
}
