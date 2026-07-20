import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CreateChannel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ channelName: "", description: "", channelBanner: "" });
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="status-text">
        You must be signed in to create a channel. <span className="link" onClick={() => navigate("/auth")}>Sign in</span>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.channelName.trim().length < 3) {
      setError("Channel name must be at least 3 characters");
      return;
    }
    try {
      const res = await api.post("/channels", form);
      navigate(`/channel/${res.data.channel._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create channel");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Your Channel</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Channel Name</label>
            <input
              value={form.channelName}
              onChange={(e) => setForm({ ...form, channelName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Banner Image URL (optional)</label>
            <input
              value={form.channelBanner}
              onChange={(e) => setForm({ ...form, channelBanner: e.target.value })}
            />
          </div>
          {error && <p className="server-message">{error}</p>}
          <button type="submit" className="btn-primary full-width">Create Channel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;