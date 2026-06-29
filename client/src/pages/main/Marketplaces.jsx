import React, { useEffect, useState } from "react";
import market_icon from "../../assets/market_icon.png";
import "../../styles/marketplaces.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import CreateMarket from "../../components/CreateMarket";

function Marketplaces() {
  const [create_markets, set_create_markets] = useState(false);
  const [my_markets, set_my_markets] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetFunds, setTargetFunds] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const marketplace = {
      name,
      description,
      target_funds: Number(targetFunds),
    };

    try {
      const response = await fetch("http://localhost:5000/market/make", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if your route is protected
        },
        body: JSON.stringify(marketplace),
      });

      const data = await response.json();

      set_my_markets(data.sellers_market);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePopup = async (e) => {
    set_create_markets(!create_markets);
  };

  const deleteMarket = async (marketId) => {
    const token = localStorage.getItem("token");

    try {
        const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/market/delete_market/${marketId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        set_my_markets((prev) =>
          prev.filter((market) => market._id !== marketId),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
    const open_new_page = async (arg) => {
    location.assign(`/main/marketplaces/${arg}`);
  };

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/market/get_market",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        console.log("data", data);
        set_my_markets(data.marketplaces);
        console.log(my_markets);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMarkets();
  }, [my_markets]);
  // console.log(my_markets[0].logo)

  return (
    <main id="marketplace_pg">
      {!my_markets.length && (
        <section id="market_center">
          <img src={market_icon} alt="" />
          <h2>No Marketplaces yet</h2>
          <button
            onClick={handlePopup}
            className="create_a_marketplaces button-with-icon"
          >
            <FontAwesomeIcon className="icon" icon={faPlus} />{" "}
            <span className="text">Create a Marketplace</span>
          </button>
        </section>
      )}

      {create_markets && <CreateMarket handlePopup={handlePopup} />}

      {my_markets.length && (
        <section id="market_content">
          <header id="market_header">
            <div id="market_actions">
              <input type="search" placeholder="Search marketplaces..." />

              <button className="create_a_marketplaces" onClick={handlePopup}>
                + Create Marketplace
              </button>
            </div>
          </header>

          <section id="market_grid">
            {/* Marketplace Card */}

            {my_markets.map((i) => (
              <article className="market_card  m2">
                <div className="market_card_header">
                  <div className="market_logo">
                    <img src={i?.logo} alt="" width={30} />
                  </div>
                </div>

                <div className="market_card_body">
                  <h3>{i?.name}</h3>

                  <p>{i?.description}</p>
                </div>

                <div className="market_stats">
                  <div>
                    <h4>Products</h4>
                    <span>{i?.products?.length}</span>
                  </div>
                </div>

                <footer className="market_card_footer">
                  <button onClick={() => open_new_page(i._id)}>Open Marketplace</button>

                  <button onClick={() => deleteMarket(i?._id)} className="icon_btn">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </footer>
              </article>
            ))}
          </section>
        </section>
      )}
    </main>
  );
}

export default Marketplaces;
