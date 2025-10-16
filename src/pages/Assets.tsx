import React, { useState } from "react";

type Asset = {
  id: number;
  name: string;
  type: string;
  location: string;
  status: string;
  lastMaintenance: string;
};

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([
    { id: 1, name: "Water Pump Station #1", type: "Water", location: "Village Center", status: "active", lastMaintenance: "2025-09-15" },
    { id: 2, name: "Solar Panel Array", type: "Energy", location: "School Building", status: "active", lastMaintenance: "2025-10-01" },
    { id: 3, name: "Street Light System", type: "Lighting", location: "Main Road", status: "pending", lastMaintenance: "2025-08-20" }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "", location: "", status: "active" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: Asset = {
      id: assets.length + 1,
      ...formData,
      lastMaintenance: new Date().toISOString().split('T')[0]
    };
    setAssets([...assets, newAsset]);
    setFormData({ name: "", type: "", location: "", status: "active" });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if(window.confirm("Delete this asset?")) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem"}}>
        <h1 className="card-title">Infrastructure Assets</h1>
        <button className="button-primary" onClick={() => setShowModal(true)}>+ Add New Asset</button>
      </div>

      <input
        className="search-bar"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="grid">
        {filteredAssets.map(asset => (
          <div className="card" key={asset.id}>
            <div className="card-title">{asset.name}</div>
            <div><strong>Type:</strong> {asset.type}</div>
            <div><strong>Location:</strong> {asset.location}</div>
            <div><strong>Status:</strong> <span className={`status-badge status-${asset.status}`}>{asset.status}</span></div>
            <div><strong>Last Maintenance:</strong> {asset.lastMaintenance}</div>
            <div style={{marginTop:"1rem", display:"flex", gap:"10px"}}>
              <button className="button-secondary" onClick={() => alert("Edit feature coming soon!")}>Edit</button>
              <button className="button-secondary" onClick={() => handleDelete(asset.id)} style={{color:"#f44336", borderColor:"#f44336"}}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{color:"#48b6d2", marginBottom:"1.5rem"}}>Add New Asset</h2>
            <form onSubmit={handleAddAsset}>
              <input
                placeholder="Asset Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                <option value="Water">Water</option>
                <option value="Energy">Energy</option>
                <option value="Lighting">Lighting</option>
                <option value="Road">Road</option>
                <option value="Building">Building</option>
              </select>
              <input
                placeholder="Location"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                required
              />
              <button className="form-btn" type="submit">Add Asset</button>
              <button className="button-secondary" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
