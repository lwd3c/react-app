import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import SearchVideo from "../components/Cards/SearchVideo";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaYoutube } from "react-icons/fa";
import { Search, Link } from "lucide-react";

const Video = () => {
  // Khai báo state để lưu thông tin người dùng, danh sách video, trạng thái loading, video đã lọc và từ khóa tìm kiếm
  const [userInfo, setUserInfo] = useState({});
  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [totalVideos, setTotalVideos] = useState(0);
  const limit = 9;

  // Sử dụng useNavigate để điều hướng trang
  const navigate = useNavigate();

  // Hàm tìm kiếm video từ API
  const searchVideos = async (query) => {
    try {
      setIsSearching(true);
      const response = await axiosInstance.get(
        `/search-videos?query=${query}&page=${currentPage}&limit=${limit}`
      );
      if (response.data) {
        setFilteredVideos(response.data.videos);
        setTotalPages(response.data.totalPages);
        setTotalVideos(response.data.totalVideos);
        setIsSearchMode(true);
      }
    } catch (error) {
      console.error("Error searching videos:", error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      getAllVideos();
      return;
    }
    await searchVideos(searchQuery);
  };

  // Xử lý khi người dùng nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý clear tìm kiếm
  const onClearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    getAllVideos();
  };

  // Hàm lấy thông tin người dùng
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      // Nếu gặp lỗi 401 (chưa đăng nhập), xóa dữ liệu và chuyển về trang đăng nhập
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Hàm lấy danh sách tất cả video từ API
  const getAllVideos = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-all-videos?page=${currentPage}&limit=${limit}`
      );
      if (response.data) {
        setAllVideos(response.data.videos);
        setFilteredVideos(response.data.videos);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching videos:", error.message);
    }
  };

  // Hàm chuyển hướng đến trang chi tiết video
  const handleDetail = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // useEffect để xử lý phân trang
  useEffect(() => {
    if (isSearchMode && searchQuery) {
      searchVideos(searchQuery);
    } else {
      getAllVideos();
    }
  }, [currentPage]);

  // Thêm useEffect để theo dõi thay đổi searchQuery
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const videosToDisplay = isSearchMode ? filteredVideos : allVideos;

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Navbar với thông tin người dùng */}
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto">
        {/* Tiêu đề */}
        <div className="flex justify-between mt-5">
          <h4 className="mt-10 font-bold font-sans text-2xl text-white p-2 border rounded-xl bg-emerald-400">
            Videos Manager
          </h4>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="flex flex-col md:flex-row justify-between mt-10 items-center">
          <div className="flex items-center space-x-2">
            <select className="text-xl p-2 border rounded-3xl">
              <option value="all">All Videos</option>
              <option value="safe">Safe</option>
              <option value="unknown">Unknown</option>
              <option value="dangerous">Dangerous</option>
            </select>
          </div>

          {isSearchMode && (
            <div className="flex flex-col items-center w-full md:w-auto mt-2 md:mt-0">
              <span className="text-sm text-gray-500 italic">
                Search results for: {searchQuery}
              </span>
              <span className="text-sm font-medium text-emerald-600 mt-1">
                Found {totalVideos} {totalVideos === 1 ? "video" : "videos"} !
              </span>
            </div>
          )}

          <div className="flex justify-end text-xl mt-4 md:mt-0">
            <SearchVideo
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Danh sách video */}
        {isSearching ? (
          <div className="text-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching videos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-xl text-gray-600">
              {isSearchMode
                ? `No videos found matching "${searchQuery}"`
                : "No videos available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mt-5">
            {videosToDisplay.map((video, index) => (
              <div
                key={index}
                className="p-5 border-4 rounded-xl bg-white shadow-md hover:shadow-lg hover:shadow-emerald-300 transition-shadow duration-200 flex items-center space-x-4 border-emerald-400"
              >
                <div className="w-14 h-14 flex flex-shrink-0 items-center justify-center bg-gray-200 rounded-full">
                  <FaYoutube className="text-red-500 text-3xl" />
                </div>
                <div className="flex flex-col justify-between h-full">
                  <h4 className="font-bold text-base text-gray-800">
                    {video.title}
                  </h4>
                  <h6 className="text-sm text-gray-600 p-2">
                    {video.description || "No description"}
                  </h6>
                  <h6 className="text-sm text-gray-600 p-1 font-bold">
                    {video.channel}
                  </h6>
                  <span className="text-xs text-gray-500">
                    {new Date(video.published_at).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <div className="flex justify-between mt-2">
                    <a
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link size={18} /> Link
                    </a>
                    <button
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
                      onClick={() => handleDetail(video._id)}
                    >
                      <Search size={18} /> Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next && Previous */}
        <div className="flex justify-center items-center mt-10 space-x-4 mb-5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-black font-bold min-w-[120px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Video;
