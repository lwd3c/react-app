import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Topic from "./pages/Topic";
import Channel from "./pages/Channel";
import Video from "./pages/Video";
import { useEffect } from "react";
import TopicDetail from "./pages/TopicDetail";
import ChannelDetail from "./pages/ChannelDetail";
import VideoDetail from "./pages/VideoDetail";

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const currentPath = location.pathname;

    if (!isLoggedIn && currentPath !== "/signup") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/topic" exact element={<Topic />} />
      <Route path="/topic/:topicId" exact element={<TopicDetail />} />
      <Route path="/channel" exact element={<Channel />} />
      <Route path="/channel/:channelId" exact element={<ChannelDetail />} />
      <Route path="/video" exact element={<Video />} />
      <Route path="/video/:videoId" exact element={<VideoDetail />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
