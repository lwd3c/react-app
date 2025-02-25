import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Home = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [allTopics, setAllTopics] = useState([]);

  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();

  // Get User userInfo
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get 6 Random Videos
  const getAllVideos = async (page = 1, limit = 6) => {
    try {
      const response = await axiosInstance.get(`/get-all-videos?page=${page}`);

      if (response.data && response.data.videos) {
        const sortedVideos = response.data.videos
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
          .slice(0, limit);

        setAllVideos(sortedVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error.message);
    }
  };

  // Get 6 Random Channels
  const getAllChannels = async (page = 1, limit = 6) => {
    try {
      const response = await axiosInstance.get(
        `/get-all-channels?page=${page}&limit=${limit}`
      );
      if (response.data && response.data.channels) {
        setAllChannels(response.data.channels);
      }
    } catch (error) {
      console.error("Error fetching channels:", error.message);
    }
  };

  // Get 6 Random Topics
  const getAllTopics = async (page = 1, limit = 6) => {
    try {
      const response = await axiosInstance.get(
        `/get-all-topics?page=${page}&limit=${limit}`
      );
      if (response.data && response.data.topics) {
        setAllTopics(response.data.topics);
      }
    } catch (error) {
      console.error("Error fetching topics:", error.message);
    }
  };

  useEffect(() => {
    getAllVideos();
    getAllChannels();
    getAllTopics();
    getUserInfo();
  }, []);

  return (
    <>
      <Sidebar />

      <Navbar userInfo={userInfo} />

      <div className="container mx-auto">
        <Dashboard
          allVideos={allVideos}
          allChannels={allChannels}
          allTopics={allTopics}
        />
      </div>
    </>
  );
};

export default Home;
