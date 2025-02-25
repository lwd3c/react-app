import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import WordCloud from "wordcloud";

const WordCloudChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data.length) {
      WordCloud(canvasRef.current, {
        list: data.map((word) => [word.text, word.value]), // Danh sách từ và tần suất xuất hiện
        gridSize: 50, // Kích thước lưới, số càng nhỏ thì khoảng cách giữa các từ càng nhỏ
        weightFacto: 10, // Hệ số nhân trọng số để điều chỉnh kích thước chữ
        fontFamily: "Arial, sans-serif", // Phông chữ sử dụng cho word cloud
        color: "random-dark", // Màu chữ, có thể là "random-light", "random-dark" hoặc mã màu cụ thể
        rotationRatio: 0.5, // Tỷ lệ xoay chữ (0: không xoay, 1: xoay hoàn toàn)
        backgroundColor: "#fafafa", // Màu nền của word cloud
      });
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width="660"
      height="400"
      className="rounded-lg"
    ></canvas>
  );
};

WordCloudChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default WordCloudChart;
