import { useNavigate } from "react-router-dom";
const links = [
  { icon: "🏠", label: "Home", path: "/" },
  { icon: "🔥", label: "Trending", path: "/?category=Entertainment" },
  { icon: "🎵", label: "Music", path: "/?category=Music" },
  { icon: "🎮", label: "Gaming", path: "/?category=Gaming" },
  { icon: "📚", label: "Education", path: "/?category=Education" },
];
const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      {links.map((link) => (
        <div key={link.label} className="sidebar-link" onClick={() => navigate(link.path)}>
          <span className="sidebar-icon">{link.icon}</span>
          {open && <span>{link.label}</span>}
        </div>
      ))}
    </aside>
  );
};
export default Sidebar;
