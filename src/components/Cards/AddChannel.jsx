import { useState } from "react";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/axiosInstance";

const AddChannel = ({ onCLose }) => {
  const [inputType, setInputType] = useState("channel_name");
  const [inputValue, setInputValue] = useState("");

  // Gọi API để thêm kênh
  const AddNewChannel = async (data) => {
    try {
      const response = await axiosInstance.post("/add-channel", data);
      return response.data.message;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to add channel!"
        );
      } else {
        throw new Error("Network error, please try again later.");
      }
    }
  };

  const handleAddChannel = async () => {
    if (!inputValue.trim()) {
      alert("Please enter a valid channel!");
      return;
    }
    alert("Added successfully! Collecting data...");

    try {
      const data =
        inputType === "channel_url"
          ? { channel_url: inputValue }
          : { channel_name: inputValue };

      const response = await AddNewChannel(data);
      alert(response);
      setInputValue("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -right-12 -top-8 hover:bg-slate-200"
        onClick={onCLose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label text-2xl">Select Input Type</label>
        <select
          className="text-xl p-2 border rounded-3xl"
          value={inputType}
          onChange={({ target }) => setInputType(target.value)}
        >
          <option value="channel_name">Channel Name</option>
          <option value="channel_url">Channel URL</option>
        </select>

        <label className="input-label text-2xl mt-2">
          {inputType === "channel_url"
            ? "Enter Channel URL"
            : "Enter Channel Name"}
        </label>
        <input
          type="text"
          className="text-2xl to-sky-800 outline-none p-2 border rounded-3xl"
          placeholder={
            inputType === "channel_url"
              ? "Enter channel URL"
              : "Enter channel name"
          }
          value={inputValue}
          onChange={({ target }) => setInputValue(target.value)}
        />
      </div>

      <button
        className="w-full bg-emerald-400 text-slate-100 my-1 hover:bg-emerald-500 hover:text-white rounded-3xl font-medium mt-8 p-2 text-xl"
        onClick={handleAddChannel}
      >
        Add Channel
      </button>
    </div>
  );
};

AddChannel.propTypes = {
  onCLose: PropTypes.func.isRequired,
};

export default AddChannel;
