import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../styles/dashboard.css";
import Header from "../../components/Header";
import API_BASE_URL from "../../config/api";

function Dashboard() {
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMarkets = marketplaces.filter((market) => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return true;

    return [market.name, market.description].some((value) =>
      value?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/markets/get_markets`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load marketplaces");
        }

        const normalizedMarkets = (data.markets || []).map((market) => ({
          id: market.id,
          name: market.name || "Unnamed Market",
          description: market.description || "No description available",
          logo:
            market.logo ||
            "https://i.pinimg.com/736x/c3/39/a6/c339a6cfea4ab12c7af03fd2d9df8814.jpg",
          banner:
            market.logo ||
            "https://i.pinimg.com/1200x/bd/1f/33/bd1f339c77ae052ff48e98fff0575ef1.jpg",
        }));

        setMarketplaces(normalizedMarkets);
      } catch (err) {
        setError(err.message || "Unable to load marketplaces");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  return (
    <section id="dashboard_pg">
      <Header />
      <section id="market_content">
        <div className="page_heading">
          <div id="pg_desc">
            <h2>MarketPlaces</h2>
            <p>Find premium goods at our variety of markets today!</p>
          </div>

          <div className="dashboard-searchbar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <section id="market_cards">
          {loading && <p>Loading marketplaces...</p>}
          {error && <p className="error_text">{error}</p>}

          {!loading && !error && filteredMarkets.length === 0 && (
            <p>No marketplaces match your search.</p>
          )}

          {!loading &&
            !error &&
            filteredMarkets.map((market) => (
              <article className="market_card" key={market.id}>
                <div className="card_img">
                  <img
                    src={market.banner}
                    alt={market.name}
                    className="market_banner"
                  />

                  <img
                    src={market.logo}
                    alt={market.name}
                    className="market_logo"
                  />
                </div>

                <div className="market_dets">
                  <h3>{market.name}</h3>
                  <p>{market.description}</p>
                </div>

                <button className="visit_market">Visit Marketplace</button>
              </article>
            ))}
        </section>
      </section>
    </section>
  );
}

export default Dashboard;
