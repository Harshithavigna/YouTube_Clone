import { useNavigate } from "react-router-dom";

// Formats a raw view count like 15200 into "15.2K views"
const formatViews = (views) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div className="video-card" onClick={() => navigate(`/video/${video._id}`)}>
      <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
      <div className="video-info">
        <div className="video-title">{video.title}</div>
        <div className="video-channel">{video.channelId?.channelName || "Unknown Channel"}</div>
        <div className="video-views">{formatViews(video.views)}</div>
      </div>
    </div>
  );
};

export default VideoCard;