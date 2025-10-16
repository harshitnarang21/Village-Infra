import React, { useState } from "react";

type WorkOrder = {
  title: string;
  budget: string;
  contractor: string;
  status: string;
  trail: string[];
};

export default function Blockchain() {
  const [orders, setOrders] = useState<WorkOrder[]>([
    {
      title: "Repair Water Pump",
      budget: "₹25,000",
      contractor: "Swachh Infra Pvt Ltd",
      status: "completed",
      trail: ["Created", "Started", "Completed", "Verified on Blockchain"]
    },
    {
      title: "Install Solar Lighting",
      budget: "₹180,000",
      contractor: "Green Power Co.",
      status: "in progress",
      trail: ["Created", "Started", "In Progress"]
    }
  ]);
  const [desc, setDesc] = useState("");
  const [budget, setBudget] = useState("");
  const [contractor, setContractor] = useState("");

  return (
    <div className="section">
      <form
        onSubmit={e => {
          e.preventDefault();
          setOrders([{
            title: desc,
            budget,
            contractor,
            status: "in progress",
            trail: ["Created"]
          }, ...orders]);
          setDesc(""); setBudget(""); setContractor("");
        }}
      >
        <div className="card-title">Blockchain Work Orders</div>
        <input placeholder="Work Description" value={desc} onChange={e => setDesc(e.target.value)} required />
        <input placeholder="Budget (₹)" value={budget} onChange={e => setBudget(e.target.value)} required />
        <input placeholder="Contractor" value={contractor} onChange={e => setContractor(e.target.value)} required />
        <button className="form-btn" type="submit">Create Work Order</button>
      </form>
      <div className="card-title" style={{marginTop:"2rem"}}>Recent Work Orders</div>
      {orders.map((order, idx) => (
        <div className="card" key={idx}>
          <div className="card-title">{order.title}</div>
          <div>Budget: <span className="important">{order.budget}</span> | Contractor: {order.contractor}</div>
          <div>Status: <span className={order.status === "completed" ? "status-completed" : "status-in-progress"}>
            {order.status}
          </span></div>
          <div>Blockchain Trail: <ul>{order.trail.map((stage,i)=><li key={i}>{stage}</li>)}</ul></div>
        </div>
      ))}
    </div>
  );
}
