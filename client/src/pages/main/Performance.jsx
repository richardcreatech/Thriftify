import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../../styles/performance.css";
import ProgressBar from "../../components/ProgressBar";

const data = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category D", value: 100 },
];

const COLORS = ["#7E2E84", "#D14081", "#B288C0"];

function Performance() {
  return (
    <section id="peformance_pg">
      <section id="performance_overview">
        <h3>Overview</h3>
        <br/>

        <div className="overview_content">
          <div className="overview_chart">
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
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip />
              {/* <Legend /> */}
            </PieChart>
          </div>

          <div className="overview_info">
            <h3>Market Performance</h3>

              <ProgressBar />
          

            <div className="stats">
              <article>
                <strong>64%</strong>
                <small>Completed</small>
              </article>

            
            </div>
          </div>
        </div>
      </section>
      <section id="performance_targets">
        <div>
          <p>Target Markets</p>
        </div>
        <br />
        <div>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
          <article>
            <div>
              <img src="https://shorturl.at/cuLTz" alt="" />
              <strong>Company Name</strong>
            </div>
            <div>
              <ProgressBar />
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}

export default Performance;
