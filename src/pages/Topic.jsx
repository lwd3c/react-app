import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import Modal from "react-modal";
import AddTopic from "../components/Cards/AddTopic";
import { MdAdd } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";
import { Search, Trash2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";

const Topic = () => {
  const [userInfo, setUserInfo] = useState({});
  const [allTopics, setAllTopics] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const navigate = useNavigate();

  const [openAddTopic, setOpenAddTopic] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const handleDeleteTopic = async (topicId) => {
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
        await axiosInstance.delete(`/delete-topic/${topicId}`);
        setIsDeleted(true);
        Swal.fire(
          "Deleted!",
          "The topic has been successfully deleted.",
          "success"
        );
        setTimeout(() => navigate(-1), 1500);
      } catch (error) {
        console.error("Error deleting topic: ", error);
        Swal.fire(
          "Error!",
          "Failed to delete the topic. Please try again.",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "You have cancelled the topic deletion.", "info");
    }
    navigate("/topic");
  };

  const handleDetail = (topicId) => {
    navigate(`/topic/${topicId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, allTopicRes] = await Promise.all([
          axiosInstance.get("/get-user"),
          axiosInstance.get(
            `/get-all-topics?page=${currentPage}&limit=${limit}`
          ),
        ]);

        if (userRes.data?.user) {
          setUserInfo(userRes.data.user);
        }

        if (allTopicRes.data) {
          setAllTopics(allTopicRes.data.topics);
          setTotalPages(allTopicRes.data.totalPages);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [currentPage, navigate]);

  return (
    <>
      <Sidebar />

      <Navbar userInfo={userInfo} />

      <ToastContainer />

      <div className="container mx-auto">
        <div className="flex justify-between mt-5">
          <h4 className="mt-10 font-bold font-sans text-2xl text-white p-2 border rounded-xl bg-emerald-400">
            Topics Manager
          </h4>
        </div>

        {/* Table */}
        <div className="mr-4 mt-5 p-6 border rounded-2xl bg-white overflow-x-auto">
          {allTopics.length > 0 ? (
            <table className="w-full border-collapse border border-emerald-600">
              <thead>
                <tr className="bg-emerald-600 text-center text-white">
                  <th className="border border-emerald-500 px-6 py-3 w-10">
                    #
                  </th>
                  <th className="border border-emerald-500 px-6 py-3 w-1/3">
                    Topic
                  </th>
                  <th className="border border-emerald-500 px-6 py-3 w-1/6">
                    Videos
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
                {allTopics.map((topic, index) => (
                  <tr key={topic._id} className="hover:bg-gray-100">
                    <td className="border border-emerald-400 px-6 py-3 text-center">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="border border-emerald-400 px-6 py-3 font-medium">
                      {topic.topic.toUpperCase()}
                    </td>
                    <td className="border border-emerald-400 px-6 py-3 text-center">
                      {topic.video_collected}
                    </td>
                    <td className="border border-emerald-400 px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <button
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
                          onClick={() => handleDetail(topic._id)}
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
                          onClick={() => handleDeleteTopic(topic._id)}
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
              No topics available
            </p>
          )}
        </div>
      </div>

      {/* Button Add Topic */}
      <div>
        <button
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-emerald-400 hover:bg-emerald-600 fixed right-10 bottom-10"
          onClick={() => {
            setOpenAddTopic({
              isShown: true,
              type: "add",
              data: null,
            });
          }}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>

        <Modal
          isOpen={openAddTopic.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=""
          className="flex w-[20%] h-[20%] bg-white rounded-md mx-auto mt-20 p-8  items-center justify-center"
        >
          <AddTopic
            onCLose={() => {
              setOpenAddTopic({ isShown: false, type: "add", data: null });
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

export default Topic;
