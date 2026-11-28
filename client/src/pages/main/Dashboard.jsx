import React, { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import "../../styles/dashboard.css";
import BrandCard from "../../components/BrandCard";
import { API_BASE_URL } from "../../config/api.js";
// import brands from "../../data/brands";

// Derive unique categories from the data

function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [brands, setBrands] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const ARTICLES_PER_PAGE = 6;

  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/articles/get_all_articles`,
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

  const currentArticles = filtered.slice(start, end);
  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  return (
    <section id="dashboard_pg">
      {/* Filter tabs */}
      <div className="filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab${activeCategory === cat ? " filter-tab--active" : ""}`}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="brand-grid">
        {currentArticles.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      {/* <canvas></canvas> */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ← Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next →
        </button>
      </div>
    </section>
  );
}

export default Dashboard;
