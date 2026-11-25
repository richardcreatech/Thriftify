
import React, { useCallback, useEffect, useState } from "react";
import market_icon from "../../assets/market_icon.png";
import "../../styles/marketplaces.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faArrowRight,
  faEye,
  faImage,
  faList,
  faPlus,
  faStore,
  faTableCellsLarge,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import CreateMarket from "../../components/CreateMarket";

function Marketplaces() {
  const [create_markets, set_create_markets] = useState(false);
  const [showCreateGuide, setShowCreateGuide] = useState(true);
  const [my_markets, set_my_markets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [bioMarket, setBioMarket] = useState(null);

  const handlePopup = () => {
    set_create_markets((prev) => !prev);
  };

  const startMarketCreation = () => {
    setShowCreateGuide(false);
    set_create_markets(true);
  };

  // Fetch the seller's marketplaces
  const fetchMarkets = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/market/get_market",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch marketplaces.");
      }

      set_my_markets(data.marketplaces || []);
    } catch (error) {
      console.error("Fetch marketplaces error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  useEffect(() => {
    if (!bioMarket) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setBioMarket(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bioMarket]);

  useEffect(() => {
    if (loading || my_markets.length || !showCreateGuide) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowCreateGuide(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, my_markets.length, showCreateGuide]);

  // Delete a marketplace
  const deleteMarket = async (marketId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/market/delete_market/${marketId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete marketplace.");
      }

      // Use the updated marketplace list returned by the backend
      set_my_markets(data.sellers_market || []);
    } catch (error) {
      console.error("Delete marketplace error:", error);
      alert(error.message);
    }
  };

  const open_new_page = (marketId) => {
    location.assign(`/main/marketplaces/${marketId}`);
  };

  // Filter marketplaces by name
  const filteredMarkets = my_markets.filter((market) =>
    market.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <main id="marketplace_pg">Loading marketplaces...</main>;
  }

  return (
    <main id="marketplace_pg">
      {!my_markets.length && (
        <section id="market_center">
          <div className="market_empty_icon">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <p className="market_empty_eyebrow">YOUR SELLER SPACE</p>
          <h2>Your selling journey starts here</h2>
          <p className="market_empty_copy">
            Create a marketplace to organize your products and give customers a
            place to discover your shop.
          </p>

          <button
            type="button"
            onClick={startMarketCreation}
            className="create_a_marketplaces"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Create your marketplace</span>
          </button>
        </section>
      )}

      {!my_markets.length && showCreateGuide && (
        <div
          className="market-guide-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreateGuide(false);
            }
          }}
        >
          <section
            className="market-guide-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-guide-title"
            aria-describedby="market-guide-description"
          >
            <button
              type="button"
              className="market-guide-close"
              onClick={() => setShowCreateGuide(false)}
              aria-label="Close marketplace guide"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="market-guide-icon">
              <FontAwesomeIcon icon={faStore} />
            </div>
            <p className="market-guide-eyebrow">A QUICK START GUIDE</p>
            <h2 id="market-guide-title">Set up your first marketplace</h2>
            <p id="market-guide-description" className="market-guide-copy">
              A marketplace is your own space to showcase products and build
              your shop on Thriftify.
            </p>

            <ol className="market-guide-steps">
              <li>
                <span>1</span>
                <div>
                  <strong>Name your shop</strong>
                  <p>Choose a name customers will recognize.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Tell shoppers about it</strong>
                  <p>Add a short description of what you sell.</p>
                </div>
              </li>
              <li>
                <span className="market-guide-step_icon">
                  <FontAwesomeIcon icon={faImage} />
                </span>
                <div>
                  <strong>Make it yours</strong>
                  <p>Add a cover image or funding goal if you like.</p>
                </div>
              </li>
            </ol>

            <button
              type="button"
              className="market-guide-cta"
              onClick={startMarketCreation}
            >
              Create a marketplace
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button
              type="button"
              className="market-guide-dismiss"
              onClick={() => setShowCreateGuide(false)}
            >
              I’ll do this later
            </button>
          </section>
        </div>
      )}

      {create_markets && (
        <CreateMarket
          handlePopup={handlePopup}
          onMarketCreated={fetchMarkets}
        />
      )}

      {!!my_markets.length && (
        <section id="market_content">
          <header id="market_header">
            <div id="market_actions">
              <input
                type="search"
                placeholder="Search marketplaces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="market_view_toggle" role="group" aria-label="Marketplace view">
                <button
                  type="button"
                  className={viewMode === "grid" ? "selected" : ""}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => {
                    setViewMode("grid");
                    setBioMarket(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTableCellsLarge} />
                </button>
                <button
                  type="button"
                  className={viewMode === "list" ? "selected" : ""}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                >
                  <FontAwesomeIcon icon={faList} />
                </button>
              </div>

              <button
                type="button"
                className="create_a_marketplaces"
                onClick={handlePopup}
              >
                <FontAwesomeIcon icon={faPlus} /> Create Marketplace
              </button>
            </div>
          </header>

          <section
            id="market_grid"
            className={viewMode === "list" ? "list_view" : ""}
          >
            {filteredMarkets.map((market) =>
              viewMode === "grid" ? (
                <article className="market_card m2" key={market.id}>
                  <div className="market_card_header">
                    <div className="market_logo">
                      <img src={market.logo || market_icon} alt="" width={30} />
                    </div>
                  </div>

                  <div className="market_card_body">
                    <h3>{market.name}</h3>
                    <p>{market.description}</p>
                  </div>

                  <div className="market_stats">
                    <div>
                      <h4>Products</h4>
                      <span>{market.product_count ?? 0}</span>
                    </div>
                  </div>

                  <footer className="market_card_footer">
                    <button onClick={() => open_new_page(market.id)}>
                      Open Marketplace
                    </button>

                    <button
                      onClick={() => deleteMarket(market.id)}
                      className="icon_btn"
                      aria-label={`Delete ${market.name}`}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </footer>
                </article>
              ) : (
                <article className="market_list_card" key={market.id}>
                  <img
                    className="market_list_logo"
                    src={market.logo || market_icon}
                    alt={`${market.name} logo`}
                  />
                  <div className="market_list_details">
                    <h3>{market.name}</h3>
                    <p>{market.product_count ?? 0} products</p>
                  </div>
                  <div className="market_list_actions">
                    <button
                      type="button"
                      className="market_list_action"
                      onClick={() => setBioMarket(market)}
                      aria-label={`Read ${market.name} bio`}
                      title="Read bio"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      <span>Read bio</span>
                    </button>
                    <button
                      type="button"
                      className="market_list_action"
                      onClick={() => open_new_page(market.id)}
                      aria-label={`Open ${market.name}`}
                      title="Open marketplace"
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      <span>Open</span>
                    </button>
                    <button
                      type="button"
                      className="market_list_action delete"
                      onClick={() => deleteMarket(market.id)}
                      aria-label={`Delete ${market.name}`}
                      title="Delete marketplace"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Delete</span>
                    </button>
                  </div>
                </article>
              ),
            )}

            {!filteredMarkets.length && (
              <p>No marketplaces match your search.</p>
            )}
          </section>

          {viewMode === "list" && bioMarket && (
            <div
              className="market_bio_overlay"
              onClick={(event) => {
                if (event.target === event.currentTarget) setBioMarket(null);
              }}
            >
              <section
                className="market_bio_dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="market_bio_title"
              >
                <button
                  type="button"
                  className="market_bio_close"
                  onClick={() => setBioMarket(null)}
                  aria-label="Close marketplace bio"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <img
                  className="market_bio_logo"
                  src={bioMarket.logo || market_icon}
                  alt=""
                />
                <h2 id="market_bio_title">{bioMarket.name}</h2>
                <p>
                  {bioMarket.description ||
                    "No bio has been added for this marketplace yet."}
                </p>
              </section>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Marketplaces;
