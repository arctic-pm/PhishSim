import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

interface Campaign {
  id: number;
  name: string;
  opened: number;
  clicked: number;
}

export function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

// dashboard.tsx
useEffect(() => {
  const fetchData = () => {
    fetch("http://localhost:5000/api/campaigns")
      .then((res) => res.json())
      .then((data: Campaign[]) => {
        setCampaigns(data);
        const opens = data.reduce((sum, c) => sum + c.opened, 0);
        const clicks = data.reduce((sum, c) => sum + c.clicked, 0);
        const rate = opens > 0 ? (clicks / opens) * 100 : 0;
        setOpenCount(opens);
        setClickCount(clicks);
        setSuccessRate(rate);
      });
  };

  fetchData(); // Initial fetch
  const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
  return () => clearInterval(interval); // Cleanup on unmount
}, []);


  const pieData = [
    { name: "Opens", value: openCount },
    { name: "Clicks", value: clickCount },
    { name: "Success Rate", value: parseFloat(successRate.toFixed(2)) }
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const barData = campaigns.map((c) => {
  const sr = c.opened > 0 ? (c.clicked / c.opened) * 100 : 0;
  return {
    name: c.name,
    opened: c.opened,
    clicked: c.clicked,
    successRate: parseFloat(sr.toFixed(2)),
  };
});


  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-semibold">Campaign Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="border p-4 rounded shadow-sm">
          <h3 className="mb-4 font-semibold">Overall Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="border p-4 rounded shadow-sm">
          <h3 className="mb-4 font-semibold">Campaign-wise Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="opened" fill="#8884d8" />
              <Bar dataKey="clicked" fill="#82ca9d" />
              <Bar dataKey="successRate" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
