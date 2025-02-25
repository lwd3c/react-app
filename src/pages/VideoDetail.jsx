import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import WordCloudChart from "../components/Charts/WordCloud";
import VideoPlayer from "../components/Cards/VideoPlayer";
import Swal from "sweetalert2";

const VideoDetail = () => {
  const { videoId } = useParams();
  const [videoDetail, setVideoDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [wordCloudData, setWordCloudData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();

  const handleDeleteVideo = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the video!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/delete-video/${videoId}`);
        setIsDeleted(true);
        Swal.fire(
          "Deleted!",
          "The video has been successfully deleted.",
          "success"
        );
        setTimeout(() => navigate(-1), 1500);
      } catch (error) {
        console.error("Error deleting video: ", error);
        Swal.fire(
          "Error!",
          "Failed to delete the video. Please try again.",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "You have cancelled the video deletion.", "info");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, videoRes] = await Promise.all([
          axiosInstance.get("/get-user"),
          axiosInstance.get(`/get-video/${videoId}`),
        ]);

        if (userRes.data?.user) {
          setUserInfo(userRes.data.user);
        }

        if (videoRes.data) {
          setVideoDetail(videoRes.data.video);
        }

        // Dữ liệu test cho WordCloud
        const mockData = [
          { text: "AI", value: 50 },
          { text: "Machine Learning", value: 40 },
          { text: "Deep Learning", value: 35 },
          { text: "NLP", value: 30 },
          { text: "ChatGPT", value: 28 },
          { text: "React", value: 25 },
          { text: "JavaScript", value: 20 },
          { text: "Python", value: 18 },
          { text: "Big Data", value: 15 },
          { text: "TensorFlow", value: 12 },
          { text: "Data Science", value: 10 },
          { text: "Neural Network", value: 8 },
        ];

        setWordCloudData(mockData);
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
  }, [videoId, navigate]);

  return (
    <>
      <Sidebar />

      <Navbar userInfo={userInfo} />

      <div className="container mx-auto mt-10 px-4">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-3 rounded-md mb-5 transition-all duration-200"
        >
          ← Back
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : videoDetail ? (
          <div className="p-8 bg-white rounded-lg shadow-lg mb-5">
            {/* Tiêu đề chính */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-500">
                VIDEO DETAILS
              </h2>

              <button
                onClick={handleDeleteVideo}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md transition-all duration-200"
              >
                Delete Video
              </button>
            </div>

            {/* Thông tin chung về chủ đề */}
            <div className="mt-6 mb-5 p-6 border rounded-lg bg-white shadow-md">
              <p className="text-xl text-black">
                TITLE:{" "}
                <span className="text-emerald-500 font-bold">
                  {videoDetail.title}
                </span>
              </p>

              <p className="text-base text-black mt-2">
                Description:{" "}
                <span className="text-emerald-500 font-bold">
                  {videoDetail.description}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Link:{" "}
                <a
                  href={videoDetail.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {videoDetail.link}
                </a>
              </p>
              <p className="text-base text-black mt-2">
                Channel:{" "}
                <span className="text-emerald-500 font-bold">
                  {videoDetail.channel}
                </span>
              </p>

              <p className="text-base text-black mt-2">
                Category:{" "}
                <span className="text-emerald-500 font-bold">
                  {videoDetail.category}{" "}
                </span>
              </p>

              {videoDetail.hashtags && videoDetail.hashtags.length > 0 && (
                <p className="text-base text-black mt-2">
                  Hashtags:{" "}
                  <span className="text-emerald-500 font-bold">
                    {videoDetail.hashtags.join(", ")}
                  </span>
                </p>
              )}

              {videoDetail.related_links &&
                videoDetail.related_links.length > 0 && (
                  <p className="text-base text-black mt-2">
                    Related Links:{" "}
                    <span className="text-emerald-500 font-bold">
                      {videoDetail.related_links.join(", ")}
                    </span>
                  </p>
                )}

              <p className="text-base text-black mt-2">
                Published at:{" "}
                <span className="text-emerald-500 font-bold">
                  {new Date(videoDetail.published_at).toLocaleDateString()}{" "}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Crawled Time:{" "}
                <span className="text-emerald-500 font-bold">
                  {new Date(videoDetail.crawl_time).toLocaleString()}{" "}
                </span>
              </p>
              <p className="text-base text-black mt-2">
                Topic:{" "}
                <span className="text-white font-bold border border-emerald-600 p-1 bg-emerald-500 rounded-md">
                  {videoDetail.topic}{" "}
                </span>
              </p>
              <p className="text-base text-black mt-4">
                Label:{" "}
                <span
                  className={`font-bold border px-2 py-1 rounded ${
                    videoDetail.label === "Safe"
                      ? "bg-green-200 border-green-500 text-green-700"
                      : videoDetail.label === "Warning"
                      ? "bg-yellow-200 border-yellow-500 text-yellow-700"
                      : "bg-red-200 border-red-500 text-red-700"
                  }`}
                >
                  {videoDetail.label} LABEL
                </span>
              </p>
            </div>

            {/* WordCloud & Video */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video */}
              <div className="mb-5 p-6 border rounded-lg bg-white shadow-md">
                <p className="text-lg font-semibold text-emerald-500 mb-4">
                  Video
                </p>
                <VideoPlayer videoDetail={videoDetail} />
              </div>

              {/* Biểu đồ WordCloud */}
              <div className="mb-5 p-6 border rounded-lg bg-white shadow-md">
                <p className="text-lg font-semibold text-emerald-500 mb-4">
                  WordClouds
                </p>
                <WordCloudChart data={wordCloudData} />
              </div>
            </div>

            {/* Reaction && Comments */}
            <div className="p-6 border rounded-lg bg-white shadow-md">
              <p className="text-lg font-semibold text-emerald-500 mb-4">
                Reaction & Comments
              </p>
              <div className="grid grid-cols-3 text-base text-black mt-2">
                <span className="text-emerald-500 font-bold text-center">
                  Likes: {videoDetail.reaction.likes} 👍
                </span>
                <span className="text-red-500 font-bold text-center">
                  Dislikes: {videoDetail.reaction.dislikes} 👎
                </span>
                <p className="text-blue-500 font-bold text-center">
                  Comments:{" "}
                  <span className="font-bold">
                    {videoDetail.comment_count} 🗨️
                  </span>
                </p>
              </div>
              {/* Bảng danh sách comment */}
              <table className="w-full mt-5 border-collapse border border-emerald-300">
                <thead>
                  <tr className="bg-emerald-400">
                    <th className="px-4 py-2 text-white border border-emerald-500">
                      Comments 🗨️
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videoDetail.comments.map((comment, index) => (
                    <tr key={index}>
                      <td className="border border-emerald-300 px-4 py-2 text-gray-800">
                        {comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Video not found!</p>
        )}
      </div>
    </>
  );
};

export default VideoDetail;
