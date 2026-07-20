import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import FilterButtons from "../components/FilterButtons";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (search) params.search = search;
        if (category && category !== "All") params.category = category;

        const res = await api.get("/videos", { params });
        setVideos(res.data.videos);
      } catch (err) {
        setError("Failed to load videos. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [search, category]);

  const handleCategorySelect = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    setSearchParams(params);
  };

  return (
    <div className="home-page">
      <FilterButtons activeCategory={category} onSelect={handleCategorySelect} />

      {loading && <p className="status-text">Loading videos...</p>}
      {error && <p className="status-text error">{error}</p>}
      {!loading && !error && videos.length === 0 && (
        <p className="status-text">No videos found.</p>
      )}

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;