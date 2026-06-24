import React, { useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import "../../styles/dashboard.css";
import BrandCard from "../../components/BrandCard";
import brands from "../../data/brands";

// Derive unique categories from the data
const categories = ["All", ...new Set(brands.map((b) => b.category))];


function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? brands
      : brands.filter((b) => b.category === activeCategory);

  return (
    <section id="dashboard_pg">
      <ProfileCard />

      {/* Filter tabs */}
      <div className="filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab${activeCategory === cat ? " filter-tab--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="brand-grid">
        {filtered.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
      {/* <canvas></canvas> */}
    </section>
  );
}

export default Dashboard;