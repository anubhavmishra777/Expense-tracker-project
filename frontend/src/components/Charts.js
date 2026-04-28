
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Charts({ refresh }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(true);

    axios.get("http://127.0.0.1:8000/get-expenses")
      .then(res => {

        let map = {};

        res.data.forEach(e => {
          const cat = e.category || "Others";
          map[cat] = (map[cat] || 0) + Number(e.amount);
        });

        const formatted = Object.keys(map).map(k => ({
          name: k,
          value: map[k]
        }));

        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.log("Chart error:", err);
        setLoading(false);
      });

  }, [refresh]);

  const COLORS = [
    "#ff4d4d",
    "#4caf50",
    "#ffeb3b",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#00bcd4",
    "#607d8b"
  ];

  if (loading) {
    return <div className="card">Loading chart...</div>;
  }

  return (
    <div className="card">
      <h3>📊 Category Distribution</h3>

      <PieChart width={350} height={350}>
        <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
        <Legend />

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

export default Charts;