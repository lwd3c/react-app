import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Search, Link } from "lucide-react";

const Dashboard = ({ allVideos, allChannels, allTopics }) => {
  const navigate = useNavigate();

  // Hàm chuyển hướng đến trang chi tiết video
  const handleDetail = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <h4 className="mt-10 p-2 font-bold font-sans text-white text-2xl border-2 rounded-xl bg-emerald-400">
          Top Videos
        </h4>
      </div>

      {/* Top Videos */}
      <div className="grid grid-cols-3 gap-6 mt-5">
        {allVideos.map((video, index) => (
          <div
            key={index}
            className="p-5 border-4 rounded-xl bg-white shadow-md hover:shadow-lg hover:shadow-emerald-300 transition-shadow duration-200 flex items-center space-x-4 border-emerald-400"
          >
            {/* Icon Video */}
            <div className="w-14 h-14 flex flex-shrink-0 items-center justify-center bg-gray-200 rounded-full">
              <FaYoutube className="text-red-500 text-3xl" />
            </div>

            {/* Nội dung */}
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

              {/* Button Detail */}
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

      <div className="grid grid-cols-2 gap-4 mb-10 mt-10">
        {/* Top Channels */}
        <div className="p-4 border rounded-2xl bg-white min-h-[450px] flex flex-col">
          <div className="flex justify-between">
            <h4 className="mb-4 font-bold font-sans text-2xl text-white p-2 border rounded-xl bg-emerald-400 text-center">
              Top Channels
            </h4>
          </div>

          <div className="flex-1 overflow-x-auto">
            {allChannels.length > 0 ? (
              <table className="w-full border-collapse border border-emerald-600">
                <thead>
                  <tr className="bg-emerald-300 text-center text-white">
                    <th className="border border-emerald-500 px-6 py-3 w-10">
                      #
                    </th>
                    <th className="border border-emerald-500 px-6 py-3 w-1/3">
                      Channel
                    </th>
                    <th className="border border-emerald-500 px-6 py-3 w-1/6">
                      Videos
                    </th>
                    <th className="border border-emerald-500 px-6 py-3 w-1/3">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allChannels.map((channel, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-emerald-400 px-6 py-3 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-emerald-400 px-6 py-3 font-medium">
                        {channel.channel_name}
                      </td>
                      <td className="border border-emerald-400 px-6 py-3 text-center">
                        {channel.video_count}
                      </td>
                      <td className="border border-emerald-400 px-6 py-3">
                        {channel.channel_url ? (
                          <a
                            href={channel.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline block truncate max-w-[150px]"
                            title={channel.channel_url}
                          >
                            {channel.channel_url}
                          </a>
                        ) : (
                          <span className="text-gray-500">
                            No URL available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No channels available
              </p>
            )}
          </div>
        </div>

        {/* Top Topics */}
        <div className="p-4 border rounded-2xl bg-white min-h-[450px] flex flex-col">
          <div className="flex justify-between">
            <h4 className="mb-4 font-bold font-sans text-2xl text-white p-2 border rounded-xl bg-emerald-400 text-center">
              Top Topics
            </h4>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {allTopics.length > 0 ? (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart
                  data={allTopics}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <XAxis
                    dataKey="topic"
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                    tickFormatter={(value) =>
                      value.length > 12
                        ? `${value.toUpperCase().substring(0, 12)}...`
                        : value.toUpperCase()
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="video_collected" fill="#34D399" name="Videos">
                    <LabelList
                      dataKey="video_collected"
                      position="middle"
                      fill="#fff"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No topics available
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.propTypes = {
  allVideos: PropTypes.array.isRequired,
  allChannels: PropTypes.array.isRequired,
  allTopics: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};

export default Dashboard;
