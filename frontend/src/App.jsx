import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="app">
      <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/channel/create" element={<CreateChannel />} />
            <Route path="/channel/:id" element={<Channel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
export default App;
