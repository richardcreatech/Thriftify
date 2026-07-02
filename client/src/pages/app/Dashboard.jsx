import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../styles/dashboard.css";
import Header from "../../components/Header";

function Dashboard() {
  const marketplaces = [
    {
      id: 1,
      name: "Life Improvement Books",
      description: "Sports & Lifestyle",
      logo: "https://i.pinimg.com/736x/c3/39/a6/c339a6cfea4ab12c7af03fd2d9df8814.jpg",
      banner:
        "https://i.pinimg.com/1200x/bd/1f/33/bd1f339c77ae052ff48e98fff0575ef1.jpg",
    },
    {
      id: 2,
      name: "Akara Central",
      description: "We sell a a variety of bean breaded entites",
      banner:
        "https://i.pinimg.com/736x/2e/68/31/2e6831aa8a373da22ade6dac8fdd2eee.jpg",
      logo: "https://i.pinimg.com/1200x/bf/7c/9f/bf7c9f4478f7857c75df629b5cccf482.jpg",
    },
    {
      id: 3,
      name: "Fashion Hub",
      description: "Clothing & Accessories",
      banner:
        "https://i.pinimg.com/736x/69/44/9f/69449f2fab70f14b9ae8dc9f73992a4c.jpg",
      logo: "https://i.pinimg.com/736x/7a/d7/37/7ad7370d113f2cc6fff230a51213ebd3.jpg",
    },
  ];
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
            <input type="text" placeholder="Search markets..." />
          </div>
        </div>

        <section id="market_cards">
          {marketplaces.map((market) => (
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
