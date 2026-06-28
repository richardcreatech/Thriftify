import React, { useState } from "react";
import market_icon from "../../assets/market_icon.png";
import "../../styles/marketplaces.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function Marketplaces() {
const [has_markets , set_has_markets] = useState(true)

    
  return (
    <main id="marketplace_pg">
      {!has_markets && (
        <section id="market_center">
          <img src={market_icon} alt="" />
          <h2>No Marketplaces yet</h2>
          <button className="create_a_marketplaces button-with-icon">
            <FontAwesomeIcon className="icon" icon={faPlus} />{" "}
            <span className="text">Create a Marketplace</span>
          </button>
        </section>
      )}

          {has_markets &&
      <section id="market_content">
        <header id="market_header">
        

          <div id="market_actions">
            <input type="search" placeholder="Search marketplaces..." />

            <button className="create_a_marketplaces">
              + Create Marketplace
            </button>
          </div>
        </header>

      

        <section id="market_grid" >
          {/* Marketplace Card */}

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         

          <article className="market_card  m2">
            <div className="market_card_header">
              <div className="market_logo">📚</div>

            </div>

            <div className="market_card_body">
              <h3>Comic Central</h3>

              <p>Comics, manga and graphic novels.</p>
            </div>

            <div className="market_stats">
              <div>
                <h4>Products</h4>
                <span>128</span>
              </div>

              <div>
                <h4>Orders</h4>
                <span>932</span>
              </div>

              <div>
                <h4>Reviews</h4>
                <span>4.8 ★</span>
              </div>
            </div>

            <footer className="market_card_footer">
              <button>Open Marketplace</button>

              <button className="icon_btn"><FontAwesomeIcon icon={faTrash}/></button>
            </footer>
          </article>
         
        </section>
          </section>
          }
    </main>
  );
}

export default Marketplaces;
