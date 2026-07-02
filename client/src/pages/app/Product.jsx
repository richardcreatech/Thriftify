import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../styles/prod.css";
import API_BASE_URL from "../../config/api";

function Product() {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/markets/get_a_market/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load market");
        }

        setMarket(data.market || null);
      } catch (err) {
        setError(err.message || "Unable to load market");
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, []);

  const categories = useMemo(() => {
    if (!market?.products) return [];

    const uniqueCategories = [...new Set(market.products.map((product) => product.category))].filter(Boolean);
    return ["All Products", ...uniqueCategories];
  }, [market]);

  const filteredProducts = useMemo(() => {
    if (!market?.products) return [];

    return market.products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" || product.category === activeCategory;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        [product.name, product.category, product.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [market, activeCategory, searchTerm]);

  return (
    <section id="product_pg">
      <section id="prod_categorizes">
        <h3>Categories</h3>

        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </section>
      <section id="prod_content">
        <header id="prod_pg_desc">
          <h2>{market?.name || "Products"}</h2>
          <span id="about_prod_pg">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </span>
        </header>

        {loading && <p>Loading products...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && filteredProducts.length === 0 && (
          <p>No products found for this category.</p>
        )}

        <section id="my_products">
          {!loading &&
            !error &&
            filteredProducts.map((product, index) => (
              <article className="prod_card" key={`${product.name}-${index}`}>
                <div>
                  <img src={product.imageURL || "product-image.jpg"} alt={product.name} />
                  <FontAwesomeIcon icon={faPlus} className="add_a_product" />
                </div>
                <span className="price">{`UGX ${product.price?.toLocaleString()}`}</span>
                <h3>{product.name}</h3>
                <p>{product.category}</p>
              </article>
            ))}
        </section>
      </section>
    </section>
  );
}

export default Product;
