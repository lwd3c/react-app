import PropTypes from "prop-types";

const VideoPlayer = ({ videoDetail }) => {
  if (!videoDetail || !videoDetail.link) return null;

  const videoId = new URL(videoDetail.link).searchParams.get("v");
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="relative w-full max-w-[660px]">
      <iframe
        src={embedUrl}
        title={videoDetail.title || "YouTube Video"}
        className="rounded-lg shadow-md w-full h-[400px]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

VideoPlayer.propTypes = {
  videoDetail: PropTypes.shape({
    link: PropTypes.string.isRequired, // Đảm bảo có link hợp lệ
    title: PropTypes.string, // Tiêu đề có thể có hoặc không
  }).isRequired,
};

export default VideoPlayer;
