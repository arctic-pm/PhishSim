import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function Analytics() {
  const [data, setData] = useState([
    { name: "Opens", value: 0 },
    { name: "Clicks", value: 0 },
    { name: "Submissions", value: 0 }
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("stats");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Campaign Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
