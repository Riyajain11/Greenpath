import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const AITrendChart = ({ data }) => {
  if (!data) return null;

  // Fake 7-day trend around predicted price (visual purpose)
  const base = data.predictedMarketPrice;
  const prices = [
    base - 80,
    base - 40,
    base - 20,
    base,
    base + 30,
    base + 60,
    base + 100,
  ];

  const chartData = {
    labels: ["D-6", "D-5", "D-4", "D-3", "Today", "D+1", "D+2"],
    datasets: [
      {
        label: "Market Price (₹/quintal)",
        data: prices,
        borderColor:
          data.suggestion.startsWith("SELL")
            ? "#16a34a"
            : data.suggestion.startsWith("HOLD")
            ? "#eab308"
            : "#dc2626",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#16a34a",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `₹${v}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AITrendChart;
