import React, { useEffect, useState } from "react";
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
  // const [data, setData] = useState([]);
  const [market_info, set_market_info] = useState([]);

  const pieData = market_info.map((market) => ({
    name: market.name,
    value: market.revenue,
  }));

  const totalRevenue = market_info.reduce(
    (sum, market) => sum + market.revenue,
    0,
  );

  const totalTarget = market_info.reduce(
    (sum, market) => sum + market.target,
    0,
  );

  const overallProgress =
    totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;

  useEffect(() => {
    const fetch_performance = async () => {
      const token = localStorage.getItem("token");

      const my_market_dets = await fetch(
        "http://localhost:5000/market/market_performance",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await my_market_dets.json();
      let markets = data.markets;

      const performanceData = markets.map((market) => ({
        name: market.name,
        target: market.target_funds,
        revenue: market.revenue_generated,
        logo: market.logo,
      }));

      set_market_info(performanceData);
      console.log(performanceData);
    };

    fetch_performance();
  }, []);

  return (
    <section id="peformance_pg">
      <section id="performance_overview">
        <h3>Overview</h3>
        <br />

        <div className="overview_content">
          <div className="overview_chart">
            <PieChart id="pie" width={400} height={400}>
              <Pie
                data={pieData}
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

            <ProgressBar value={totalRevenue} max={totalTarget} />

            <div className="stats">
              <article>
                <strong>{overallProgress.toFixed(0)}%</strong>
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
          {market_info?.map((market) => (
            // <article key={market.name}>
            //   <div>
            //     <strong>{market.name}</strong>
            //     <span>
            //       ₦{market.revenue} / ₦{market.target}
            //     </span>
            //   </div>

            //   <ProgressBar value={market.revenue} max={market.target} />
            // </article>
            <article>
              <div>
                {/* <img src="https://shorturl.at/cuLTz" alt="" /> */}
                <img src={market.logo} alt="" />
                <strong>{market.name}</strong>
              </div>
              <div>
                <ProgressBar value={market.revenue} max={market.target} />
                {/* <ProgressBar /> */}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Performance;
