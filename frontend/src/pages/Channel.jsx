import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";

const emptyVideoForm = {
  title: "",
  description: "",
  thumbnailUrl: "",
  videoUrl: "",
  category: "Other",
};

const Channel = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [form, setForm] = useState(emptyVideoForm);
  const [error, setError] = useState("");

  const isOwner = user && channel && channel.owner?._id === user.id;

  const fetchChannel = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/channels/${id}`);
      setChannel(res.data.channel);
    } catch (err) {
      setError("Channel not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openCreateForm = () => {
    setForm(emptyVideoForm);
    setEditingVideoId(null);
    setShowForm(true);
  };

  const openEditForm = (video) => {
    setForm({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      category: video.category,
    });
    setEditingVideoId(video._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVideoId) {
        await api.put(`/videos/${editingVideoId}`, form);
      } else {
        await api.post("/videos", { ...form, channelId: id });
      }
      setShowForm(false);
      fetchChannel();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save video");
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    await api.delete(`/videos/${videoId}`);
    fetchChannel();
  };

  if (loading) return <p className="status-text">Loading channel...</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="channel-page">
      <img src={channel.channelBanner} alt="Channel banner" className="channel-banner" />
      <div className="channel-header">
        <h2>{channel.channelName}</h2>
        <p>{channel.subscribers} subscribers</p>
        <p className="channel-description">{channel.description}</p>
        {isOwner && (
          <button className="btn-primary" onClick={openCreateForm}>
            Upload Video
          </button>
        )}
      </div>

      {showForm && (
        <form className="video-form" onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Thumbnail URL"
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            required
          />
          <input
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {["Music", "Gaming", "Education", "Sports", "News", "Entertainment", "Technology", "Other"].map(
              (cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              )
            )}
          </select>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingVideoId ? "Save Changes" : "Upload"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="video-grid">
        {channel.videos.map((video) => (
          <div key={video._id} className="channel-video-wrapper">
            <VideoCard video={{ ...video, channelId: { channelName: channel.channelName } }} />
            {isOwner && (
              <div className="channel-video-actions">
                <button onClick={() => openEditForm(video)}>Edit</button>
                <button onClick={() => handleDelete(video._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channel;