// import { FaMagnifyingGlass } from "react-icons/fa6";
// import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";

const SearchVideo = ({
  value,
  onChange,
  handleSearch,
  onClearSearch,
  onKeyPress,
}) => {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search videos..."
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="p-2 border rounded-md w-96 focus:outline-none focus:border-emerald-400"
      />
      <button
        onClick={handleSearch}
        className="bg-emerald-400 text-white px-4 py-2 hover:bg-emerald-500 rounded-md"
      >
        Search
      </button>
      {value && (
        <button
          onClick={onClearSearch}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          Clear
        </button>
      )}
    </div>
  );
};

SearchVideo.propTypes = {
  value: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
};

export default SearchVideo;
