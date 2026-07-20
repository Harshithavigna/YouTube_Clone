import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ onToggleSidebar }) => {
  const [searchText, setSearchText] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchText)}`);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          ☰
        </button>
        <span className="logo" onClick={() => navigate("/")}>
          ▶️ TubeClone
        </span>
      </div>

      <form className="header-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" aria-label="Search">🔍</button>
      </form>

      <div className="header-right">
        {user ? (
          <>
            <span className="username">Hi, {user.username}</span>
            <button className="btn-outline" onClick={() => navigate("/channel/create")}>
              Create Channel
            </button>
            <button className="btn-outline" onClick={() => { logout(); navigate("/"); }}>
              Sign Out
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/auth")}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;