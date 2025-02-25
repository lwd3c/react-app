import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { Search, Link } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import PieCharts from "../components/Charts/PieChart";
import ChannelLineCharts from "../components/Charts/ChannelLineChart";

const ChannelDetail = () => {
  const { channelId } = useParams();
  const [channelDetail, setChannelDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [allVideos, setAllVideos] = useState([]);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

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
        const [userRes, channelRes] = await Promise.all([
          axiosInstance.get("/get-user"),
          axiosInstance.get(`/get-channel/${channelId}`),
        ]);

        if (userRes.data?.user) {
          setUserInfo(userRes.data.user);
        }

        if (channelRes.data) {
          setChannelDetail(channelRes.data.channel);
          setAllVideos(channelRes.data.videos || []);

          // Nhóm video theo tháng
          const timelineData = channelRes.data.videos.reduce((acc, video) => {
            const date = new Date(video.published_at);
            const month = `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}`;
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});

          setChartData(
            Object.entries(timelineData).map(([month, Videos]) => ({
              month,
              Videos,
            }))
          );
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
  }, [channelId, navigate]);

  return (
    <>
      <Sidebar />

      <Navbar userInfo={userInfo} />

      <div className="container mx-auto mt-10 px-4">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate("/channel")}
          className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-3 rounded-md mb-5 transition-all duration-200"
        >
          ← Back
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : channelDetail ? (
          <div className="p-8 bg-white rounded-lg shadow-lg mb-5">
            {/* Tiêu đề chính */}
            <h2 className="text-2xl font-bold text-emerald-500 mb-6">
              CHANNEL DETAILS / {channelDetail.channel_name.toUpperCase()}
            </h2>

            {/* Thông tin chung về chủ đề */}
            <div className="mt-6 mb-5 p-6 border rounded-lg bg-white shadow-md">
              <p className="text-xl text-black">
                CHANNEL:{" "}
                <span className="text-emerald-500 font-bold">
                  {channelDetail.channel_name}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Link:{" "}
                <a
                  href={channelDetail.channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {channelDetail.channel_url}
                </a>
              </p>
              <p className="text-base text-black mt-2">
                Description:{" "}
                <span className="text-emerald-500 font-bold">
                  {channelDetail.channel_description}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Subscribers:{" "}
                <span className="text-emerald-500 font-bold">
                  {channelDetail.subscriber_count}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Total Views:{" "}
                <span className="text-emerald-500 font-bold">
                  {channelDetail.view_count}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Total Videos:{" "}
                <span className="text-emerald-500 font-bold">
                  {channelDetail.video_count}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Published at:{" "}
                <span className="text-emerald-500 font-bold">
                  {new Date(channelDetail.published_at).toLocaleDateString()}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Last Crawled:{" "}
                <span className="text-emerald-500 font-bold">
                  {new Date(channelDetail.crawl_time).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Phân tích dữ liệu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Biểu đồ Pie */}
              <div className="p-6 border rounded-lg bg-white shadow-md">
                <p className="text-lg font-semibold text-emerald-500 mb-4">
                  Channel Analysis
                </p>
                <PieCharts pieData={pieData} />
              </div>

              {/* Biểu đồ Line - chỉ hiển thị nếu có dữ liệu */}
              {chartData.length > 0 && (
                <div className="p-6 border rounded-lg bg-white shadow-md">
                  <p className="text-lg font-semibold text-emerald-500 mb-4">
                    Videos Upload Time
                  </p>
                  <ChannelLineCharts chartData={chartData} />
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
          <p className="text-red-500">Channel not found!</p>
        )}
      </div>
    </>
  );
};

export default ChannelDetail;
