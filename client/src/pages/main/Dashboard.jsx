import React, { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import "../../styles/dashboard.css";
import BrandCard from "../../components/BrandCard";
// import brands from "../../data/brands";

// Derive unique categories from the data

function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/articles/get_all_articles",
        );
        const data = await response.json();

        const formatted = data.articles.map((article) => ({
          id: article.url,
          name: article.site_name,
          logo: article.site_logo,
          description: article.title,
          category: article.site_name,
          accent: "#4f46e5",
          url: article.url,
        }));

        setBrands(formatted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, []);

  const categories = ["All", ...new Set(brands.map((b) => b.category))];

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
