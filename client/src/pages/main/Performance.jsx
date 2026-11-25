import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/performance.css";
import ProgressBar from "../../components/ProgressBar";

const COLORS = ["#b45cff", "#e36acb", "#6e8cff", "#39c5ab", "#f0a35e"];
const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function Performance() {
  const [marketInfo, setMarketInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalRevenue = marketInfo.reduce((sum, market) => sum + market.revenue, 0);
  const totalTarget = marketInfo.reduce((sum, market) => sum + market.target, 0);
  const overallProgress =
    totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;
  const pieData = marketInfo
    .filter((market) => market.revenue > 0)
    .map((market) => ({ name: market.name, value: market.revenue }));

  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/market/market_performance",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch performance data.");
      }

      const markets = Array.isArray(data.markets) ? data.markets : [];
      setMarketInfo(
        markets.map((market) => ({
          id: market.id ?? market._id ?? market.name,
          name: market.name || "Untitled marketplace",
          target: Number.isFinite(Number(market.target_funds))
            ? Math.max(0, Number(market.target_funds))
            : 0,
          revenue: Number.isFinite(Number(market.revenue_generated))
            ? Math.max(0, Number(market.revenue_generated))
            : 0,
          logo: market.logo,
        })),
      );
    } catch (fetchError) {
      console.error("Fetch performance error:", fetchError);
      setError(fetchError.message || "Failed to fetch performance data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return (
    <main id="performance_pg">
      <header className="performance_header">
        <div>
          <p className="performance_eyebrow">SELLER ANALYTICS</p>
          <h1>Performance</h1>
          <p>Track marketplace revenue and progress toward your targets.</p>
        </div>
      </header>

      {loading ? (
        <section className="performance_state" role="status">
          <span className="performance_loader" />
          <p>Loading your performance...</p>
        </section>
      ) : error ? (
        <section className="performance_state performance_error" role="alert">
          <h2>Performance data couldn’t be loaded</h2>
          <p>{error}</p>
          <button type="button" onClick={fetchPerformance}>
            Try again
          </button>
        </section>
      ) : marketInfo.length === 0 ? (
        <section className="performance_empty">
          <div className="performance_empty_icon">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <p className="performance_eyebrow">YOUR PERFORMANCE, IN ONE PLACE</p>
          <h2>Nothing to measure just yet</h2>
          <p>
            Create a marketplace to start tracking revenue and progress toward
            your sales targets.
          </p>
          <Link to="/main" className="performance_empty_link">
            Go to marketplaces
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </section>
      ) : (
        <>
          <section className="performance_metrics" aria-label="Performance summary">
            <article className="performance_metric">
              <span className="performance_metric_icon">
                <FontAwesomeIcon icon={faChartLine} />
              </span>
              <div>
                <p>Total revenue</p>
                <strong>{currencyFormatter.format(totalRevenue)}</strong>
              </div>
            </article>
            <article className="performance_metric">
              <span className="performance_metric_icon target_icon">
                <FontAwesomeIcon icon={faStore} />
              </span>
              <div>
                <p>Combined target</p>
                <strong>{currencyFormatter.format(totalTarget)}</strong>
              </div>
            </article>
            <article className="performance_metric">
              <span className="performance_metric_icon progress_icon">
                <span aria-hidden="true">%</span>
              </span>
              <div>
                <p>Target completion</p>
                <strong>{overallProgress.toFixed(0)}%</strong>
              </div>
            </article>
          </section>

          <section className="performance_overview">
            <div className="performance_section_heading">
              <div>
                <h2>Revenue overview</h2>
                <p>Revenue contribution by marketplace</p>
              </div>
            </div>

            <div className="performance_overview_content">
              <div className="performance_chart">
                {pieData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="82%"
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => currencyFormatter.format(value)}
                        contentStyle={{
                          color: "#f5f2f8",
                          background: "#201d25",
                          border: "1px solid #39333f",
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="performance_chart_empty">
                    <span>No revenue recorded</span>
                  </div>
                )}
              </div>

              <div className="performance_overview_info">
                <div>
                  <h3>Overall target progress</h3>
                  <p>
                    {currencyFormatter.format(totalRevenue)} of{" "}
                    {currencyFormatter.format(totalTarget)} earned
                  </p>
                </div>
                <ProgressBar
                  value={totalRevenue}
                  max={totalTarget || 1}
                  color="#bb67f1"
                />
                <div className="performance_progress_summary">
                  <strong>{overallProgress.toFixed(0)}%</strong>
                  <span>of combined target</span>
                </div>
                {totalTarget === 0 && (
                  <p className="performance_target_note">
                    Add a target to a marketplace to track goal progress.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="performance_targets">
            <div className="performance_section_heading">
              <div>
                <h2>Marketplace targets</h2>
                <p>Revenue and goal progress for each marketplace</p>
              </div>
            </div>
            <div className="performance_target_grid">
              {marketInfo.map((market, index) => {
                const progress =
                  market.target > 0
                    ? Math.min((market.revenue / market.target) * 100, 100)
                    : 0;

                return (
                  <article className="performance_target_card" key={market.id}>
                    <div className="performance_target_header">
                      {market.logo ? (
                        <img src={market.logo} alt="" />
                      ) : (
                        <span className="performance_market_icon">
                          <FontAwesomeIcon icon={faStore} />
                        </span>
                      )}
                      <div>
                        <h3>{market.name}</h3>
                        <p>
                          {currencyFormatter.format(market.revenue)} earned
                        </p>
                      </div>
                      <span
                        className="performance_target_percent"
                        style={{
                          "--market-color": COLORS[index % COLORS.length],
                        }}
                      >
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar
                      value={market.revenue}
                      max={market.target || 1}
                      color={COLORS[index % COLORS.length]}
                    />
                    <div className="performance_target_footer">
                      <span>Target</span>
                      <strong>{currencyFormatter.format(market.target)}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Performance;
