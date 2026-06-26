import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../../styles/performance.css";

const data = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category D", value: 100 },
];

const COLORS = ["#7E2E84", "#D14081", "#B288C0"];

function Performance() {
  return (
    <section>
      <PieChart id="pie" width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          innerRadius={80} // 👈 This is what makes it a donut
          outerRadius={140}
         
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip />
        {/* <Legend /> */}
      </PieChart>
    </section>
  );
}

export default Performance;
