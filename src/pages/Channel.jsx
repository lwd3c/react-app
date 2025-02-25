import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import Modal from "react-modal";
import AddChannel from "../components/Cards/AddChannel";
import { MdAdd } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
// import { LuRefreshCw } from "react-icons/lu";
import { Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Channel = () => {
  const [userInfo, setUserInfo] = useState({});
  const [allChannels, setAllChannels] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [openAddChannel, setOpenAddChannel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // Số lượng topic trên mỗi trang

  const getAllChannels = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-all-channels?page=${currentPage}&limit=${limit}`
      );
      if (response.data) {
        setAllChannels(response.data.channels);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching channels:", error.message);
    }
  };

  useEffect(() => {
    getAllChannels();
    getUserInfo();
  }, [currentPage]);

  const handleDelete = async (channelId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this channel?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axiosInstance.delete(
                `/delete-channel/${channelId}`
              );
              if (response.data && !response.data.error) {
                toast.success(
                  response.data.message || "Channel deleted successfully!"
                );
                getAllChannels();
              } else {
                toast.error(
                  response.data.message || "Failed to delete channel!"
                );
              }
            } catch (error) {
              console.error("Error deleting channel:", error.message);
              toast.error("Error deleting channel!");
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Channel deletion canceled!"),
        },
      ],
    });
  };

  const handleDetail = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  return (
    <>
      <Sidebar />

      <Navbar userInfo={userInfo} />

      <ToastContainer />

      <div className="container mx-auto">
        <div className="flex justify-between mt-5">
          <h4 className="mt-10 font-bold font-sans text-2xl text-white p-2 border rounded-xl bg-emerald-400">
            Channels Manager
          </h4>
        </div>

        {/* Table */}
        <div className="mr-4 mt-5 p-6 border rounded-2xl bg-white overflow-x-auto">
          {allChannels.length > 0 ? (
            <table className="w-full border-collapse border border-emerald-600">
              <thead>
                <tr className="bg-emerald-600 text-center text-white">
                  <th className="border border-emerald-500 px-6 py-3 w-10">
                    #
                  </th>
                  <th className="border border-emerald-500 px-6 py-3 w-1/3">
                    Channel
                  </th>
                  <th className="border border-emerald-500 px-6 py-3 w-1/6">
                    Subscribers
                  </th>
                  <th className="border border-emerald-500 px-6 py-3 w-1/3">
                    Details
                  </th>
                  <th className="border border-emerald-500 px-6 py-3 w-1/3">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {allChannels.map((channel, index) => (
                  <tr key={channel._id} className="hover:bg-gray-100">
                    <td className="border border-emerald-400  px-6 py-3 text-center">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="border border-emerald-400  px-6 py-3 font-medium">
                      {channel.channel_name}
                    </td>
                    <td className="border border-emerald-400  px-6 py-3 text-center">
                      {channel.subscriber_count}
                    </td>
                    <td className="border border-emerald-400 px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <button
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
                          onClick={() => handleDetail(channel._id)}
                        >
                          <Search size={18} />
                          Detail
                        </button>
                      </div>
                    </td>
                    <td className="border border-emerald-400 px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
                          onClick={() => handleDelete(channel._id)}
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </div>
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

      {/* Button Add Channel */}
      <div>
        <button
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-emerald-400 hover:bg-emerald-600 fixed right-10 bottom-10"
          onClick={() => {
            setOpenAddChannel({
              isShown: true,
              type: "add",
              data: null,
            });
          }}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>

        <Modal
          isOpen={openAddChannel.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=""
          className="flex w-[28%] h-[40%] bg-white rounded-3xl mx-auto mt-20 p-8  items-center justify-center"
        >
          <AddChannel
            onCLose={() => {
              setOpenAddChannel({ isShown: false, type: "add", data: null });
            }}
          />
        </Modal>
      </div>

      {/* Next && Previous */}
      <div className="flex justify-center items-center mt-10 space-x-4">
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
    </>
  );
};

export default Channel;
