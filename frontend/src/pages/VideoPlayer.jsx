import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data.video);
    } catch (err) {
      setError("Video not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const requireLogin = () => {
    if (!user) {
      navigate("/auth");
      return true;
    }
    return false;
  };

  const handleLike = async () => {
    if (requireLogin()) return;
    const res = await api.patch(`/videos/${id}/like`);
    setVideo((v) => ({ ...v, likes: new Array(res.data.likes), dislikes: new Array(res.data.dislikes) }));
  };

  const handleDislike = async () => {
    if (requireLogin()) return;
    const res = await api.patch(`/videos/${id}/dislike`);
    setVideo((v) => ({ ...v, likes: new Array(res.data.likes), dislikes: new Array(res.data.dislikes) }));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (requireLogin()) return;
    if (!commentText.trim()) return;

    const res = await api.post(`/videos/${id}/comments`, { text: commentText });
    setVideo((v) => ({ ...v, comments: res.data.comments }));
    setCommentText("");
  };

  const handleUpdateComment = async (commentId) => {
    const res = await api.put(`/videos/${id}/comments/${commentId}`, { text: editingText });
    setVideo((v) => ({ ...v, comments: res.data.comments }));
    setEditingCommentId(null);
  };

  const handleDeleteComment = async (commentId) => {
    const res = await api.delete(`/videos/${id}/comments/${commentId}`);
    setVideo((v) => ({ ...v, comments: res.data.comments }));
  };

  if (loading) return <p className="status-text">Loading video...</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="video-player-page">
      <div className="video-main">
        <video className="video-player" src={video.videoUrl} controls />

        <h2 className="video-title-large">{video.title}</h2>

        <div className="video-meta-row">
          <span
            className="video-channel-link"
            onClick={() => navigate(`/channel/${video.channelId._id}`)}
          >
            {video.channelId?.channelName}
          </span>
          <div className="like-dislike">
            <button onClick={handleLike}>👍 {video.likes.length}</button>
            <button onClick={handleDislike}>👎 {video.dislikes.length}</button>
          </div>
        </div>

        <p className="video-description">{video.description}</p>

        <div className="comments-section">
          <h3>{video.comments.length} Comments</h3>

          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder={user ? "Add a comment..." : "Sign in to comment"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user}
            />
            <button type="submit" disabled={!user}>Comment</button>
          </form>

          {video.comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-author">{comment.username}</div>
              {editingCommentId === comment._id ? (
                <div className="comment-edit-row">
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => handleUpdateComment(comment._id)}>Save</button>
                  <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="comment-text">{comment.text}</div>
                  {user && comment.userId?._id === user.id && (
                    <div className="comment-actions">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditingText(comment.text);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;