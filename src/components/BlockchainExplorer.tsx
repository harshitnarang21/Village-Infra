import React, { useState, useEffect } from 'react';

type WorkOrder = {
  id?: string | number;
  title?: string;
  description?: string;
  budget: string;
  contractor: string;
  status: string;
  trail?: string[];
};

const BlockchainExplorer: React.FC = () => {
  const [workDesc, setWorkDesc] = useState('');
  const [budget, setBudget] = useState('');
  const [contractor, setContractor] = useState('');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    fetch('/api/workorders')
      .then(res => res.json())
      .then((data: WorkOrder[]) => setWorkOrders(data))
      .catch(() => setWorkOrders([]));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('/api/workorders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        description: workDesc, budget, contractor
      }),
    })
    .then(res => res.json())
    .then((newOrder: WorkOrder) => {
      setWorkOrders([...workOrders, newOrder]);
      setWorkDesc('');
      setBudget('');
      setContractor('');
    });
  };

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit}>
        <div className="form-title">Blockchain Work Orders</div>
        <input
          placeholder="Work Description"
          value={workDesc}
          onChange={e => setWorkDesc(e.target.value)}
          required
        />
        <input
          placeholder="Budget (₹)"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          required
        />
        <input
          placeholder="Contractor"
          value={contractor}
          onChange={e => setContractor(e.target.value)}
          required
        />
        <button className="form-btn" type="submit">Create Work Order</button>
      </form>

      <div className="section-title" style={{marginTop: "2.5rem"}}>
        Recent Work Orders (Blockchain Verified)
      </div>

      {workOrders.length === 0 ? (
        <div style={{color: '#b7b7c9'}}>No work orders found.</div>
      ) : (
        workOrders.map((order, idx) => (
          <div className="workorder-box" key={order.id || idx}>
            <div className="workorder-title">{order.title || order.description}</div>
            <div>Budget: <span className="important">₹{order.budget}</span></div>
            <div>Contractor: {order.contractor}</div>
            <div>
              Status: <span className={order.status === "completed" ? "status-completed" : "status-in-progress"}>
                {order.status}
              </span>
            </div>
            {order.trail && (
              <>
                <div>Blockchain Audit Trail:</div>
                <ul>
                  {order.trail.map((stage: string, i: number) => (
                    <li key={i}>{stage}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BlockchainExplorer;
