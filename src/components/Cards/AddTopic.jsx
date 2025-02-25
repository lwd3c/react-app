import { useState } from "react";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/axiosInstance";

const AddTopic = ({ onCLose }) => {
  const [topic, setTopic] = useState("");

  // Call API Add Topic
  const AddNewTopic = async (topic) => {
    try {
      const response = await axiosInstance.post("/add-topic", { topic });
      // console.log("Server Response:", response.data);
      return response.data.message;
    } catch (error) {
      console.error("Error details:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        throw new Error(error.response.data.message || "Failed to add topic!");
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error(
          "Server is not responding. Please check your connection."
        );
      } else {
        console.error("Request setup error:", error.message);
        throw new Error("Unexpected error occurred. Try again.");
      }
    }
  };

  const handleAddTopic = async () => {
    if (!topic) {
      alert("Please enter a valid topic!");
      return;
    }
    alert("Added successfully! Collecting data...");

    try {
      const response = await AddNewTopic(topic);
      alert(response);
      setTopic("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -right-3 -top-3 hover:bg-slate-50"
        onClick={onCLose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label text-xl">TOPIC</label>
        <input
          type="text"
          className="text-2xl to-sky-950 outline-none"
          placeholder="Create a new Topic"
          value={topic}
          onChange={({ target }) => setTopic(target.value)}
        />
      </div>

      <button
        className="btn-primary font-medium mt-5 p-2 text-xl"
        onClick={handleAddTopic}
      >
        Add Topic
      </button>
    </div>
  );
};

AddTopic.propTypes = {
  onCLose: PropTypes.func.isRequired,
};

export default AddTopic;
