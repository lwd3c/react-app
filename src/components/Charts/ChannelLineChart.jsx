import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ChannelLineCharts = ({ chartData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter={(month) => month} />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="Videos"
          stroke="#10b981"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChannelLineCharts;
