import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import PieCharts from "../components/Charts/PieChart";
import TopicLineCharts from "../components/Charts/TopicLineChart";
import { FaYoutube } from "react-icons/fa";
import { Search, Link } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topicDetail, setTopicDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [chartData, setChartData] = useState([]);
  const [allVideos, setAllVideos] = useState([]);

  const handleDetail = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const pieData = [
    { name: "Safe", value: 400 },
    { name: "Dangerous", value: 200 },
    { name: "Potential Risk", value: 150 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, topicRes] = await Promise.all([
          axiosInstance.get("/get-user"),
          axiosInstance.get(`/get-topic/${topicId}`),
        ]);

        if (userRes.data?.user) {
          setUserInfo(userRes.data.user);
        }

        if (topicRes.data) {
          setTopicDetail(topicRes.data.topic);
          setChartData(topicRes.data.video_timeline || []);
          setAllVideos(topicRes.data.videos || []);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          console.error("Error fetching data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [topicId, navigate]);

  return (
    <>
      <Sidebar />
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto mt-10 px-4">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate("/topic")}
          className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-3 rounded-md mb-5 transition-all duration-200"
        >
          ← Back
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : topicDetail ? (
          <div className="p-8 bg-white rounded-lg shadow-lg mb-5">
            {/* Tiêu đề chính */}
            <h2 className="text-2xl font-bold text-emerald-500 mb-6">
              TOPIC DETAILS / {topicDetail.topic.toUpperCase()}
            </h2>

            {/* Thông tin chung về chủ đề */}
            <div className="mt-6 mb-6 p-6 border rounded-lg bg-white shadow-md">
              <p className="text-xl text-black">
                TOPIC:{" "}
                <span className="text-emerald-500 font-bold">
                  {topicDetail.topic.toUpperCase()}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Video Collected:{" "}
                <span className="text-emerald-500 font-bold">
                  {topicDetail.video_collected}
                </span>
              </p>
            </div>

            {/* Phân tích dữ liệu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Biểu đồ Pie */}
              <div className="p-6 border rounded-lg bg-white shadow-md">
                <p className="text-lg font-semibold text-emerald-500 mb-4">
                  Topic Analysis
                </p>
                <PieCharts pieData={pieData} />
              </div>

              {/* Biểu đồ Line - chỉ hiển thị nếu có dữ liệu */}
              {chartData.length > 0 && (
                <div className="p-6 border rounded-lg bg-white shadow-md">
                  <p className="text-lg font-semibold text-emerald-500 mb-4">
                    Videos Collection Over Time
                  </p>
                  <TopicLineCharts chartData={chartData} />
                </div>
              )}
            </div>

            {/* Related Videos */}
            <div className="p-6 border rounded-lg bg-white shadow-md mt-6">
              <p className="text-lg font-semibold text-emerald-500 mb-4">
                Related Videos
              </p>
              <Swiper
                spaceBetween={20}
                slidesPerView={4}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                navigation
                pagination={{ el: ".custom-pagination", clickable: true }}
                modules={[Navigation, Pagination]}
                className="mt-5 relative pb-12"
              >
                {allVideos.map((video, index) => (
                  <SwiperSlide key={index}>
                    <div className="p-5 border-4 rounded-xl bg-white shadow-md hover:shadow-lg hover:shadow-emerald-300 transition-shadow duration-200 flex flex-col border-emerald-400 h-[420px]">
                      {/* Biểu tượng video */}
                      <div className="w-full aspect-[16/9] flex-shrink-0 flex items-center justify-center bg-gray-200 mx-auto overflow-hidden rounded-md">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaYoutube className="text-red-500 text-6xl" />
                        )}
                      </div>

                      {/* Nội dung video */}
                      <div className="mt-3 flex-grow flex flex-col text-center">
                        <h4 className="font-bold text-base text-gray-800 line-clamp-2">
                          {video.title}
                        </h4>
                        <h6 className="text-sm text-gray-600 p-2 line-clamp-none">
                          {video.description || "No description"}
                        </h6>
                      </div>

                      {/* Button - Giữ cố định */}
                      <div className="flex justify-between mt-auto mb-2">
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
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Đưa phân trang xuống dưới */}
              {/* <div className="custom-pagination flex justify-center mt-5 flex-wrap gap-1 overflow-hidden"></div> */}
            </div>
          </div>
        ) : (
          <p className="text-red-500">Topic not found!</p>
        )}
      </div>
    </>
  );
};

export default TopicDetail;
