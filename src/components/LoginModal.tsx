import React, { useState } from "react";

interface LoginModalProps {
  open: boolean;
  onSuccess: () => void;
  onClose?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{textAlign:"center", marginBottom:"24px"}}>
          <h2 className="logo" style={{fontSize:"2rem", marginBottom:"8px"}}>Sudarshan</h2>
          <p style={{color:"var(--text-gray)"}}>Sign in to access your dashboard</p>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (email && pass) { onSuccess(); }
          }}
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          <button className="form-btn" type="submit" style={{width:"100%", marginTop:"8px"}}>
            Sign In
          </button>
        </form>
        {onClose && (
          <button
            className="button-secondary"
            style={{width:"100%", marginTop:"12px"}}
            onClick={onClose}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
