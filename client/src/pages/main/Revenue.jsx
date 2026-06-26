import React from "react";
import ProfileCard from "../../components/ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBank, faCoins, faWallet } from "@fortawesome/free-solid-svg-icons";
import "../../styles/revenue.css";

function Revenue() {
  return (
    <section id="revenue_pg">
      <header>
        <p>Revenue</p>
      </header>

      <section id="revenue_content">
        <section id="revenue_overview">
          <article className="revenue_info_card">
            <span>
              <FontAwesomeIcon icon={faWallet} />
            </span>
            <div>
              <p>Available Balance</p>
              <h1>245000</h1>
              <p>Pend Balance</p>
            </div>
          </article>

          <article className="revenue_info_card">
            <span>
              <FontAwesomeIcon icon={faWallet} />
            </span>
            <div>
              <p>Available Balance</p>
              <h1>245000</h1>
              <p>Pend Balance</p>
            </div>
          </article>

          <article className="revenue_info_card">
            <span>
              <FontAwesomeIcon icon={faWallet} />
            </span>
            <div>
              <p>Available Balance</p>
              <h1>245000</h1>
              <p>Pend Balance</p>
            </div>
          </article>

          <article className="revenue_info_card">
            <span>
              <FontAwesomeIcon icon={faWallet} />
            </span>
            <div>
              <p>Available Balance</p>
              <h1>245000</h1>
              <p>Pend Balance</p>
            </div>
          </article>
        </section>
        <section id="revenue_withdraw_options">
          <article className="withdraw_opt_card">
            <div>
              <span>
                <FontAwesomeIcon icon={faCoins} />
              </span>
              <small>Market Earnings</small>
            </div>

            <div>
              <h2>239000</h2>
              <p>Available Balance</p>
            </div>
            <div>
              <button>WIthdraw</button>
            </div>
          </article>
          <article className="withdraw_opt_card">
            <div>
              <span>
                <FontAwesomeIcon icon={faCoins} />
              </span>
              <small>Market Earnings</small>
            </div>

            <div>
              <h2>239000</h2>
              <p>Available Balance</p>
            </div>
            <div>
              <button>WIthdraw</button>
            </div>
          </article>

          <article className="Withdraw funds">
            <h2>Withdrawal Account</h2>
            <div>
              <span>
                <input type="text" placeholder="000" />
              </span>
            </div>

            <button className="withdraw_funds">Withdraw Funds</button>
          </article>

          <article className="change_account_details">
            <h2>Withdrawal Account</h2>
            <div>
              <span>
                <FontAwesomeIcon icon={faBank} />
              </span>
              <span>
                <h3>Bank Name</h3>
                <p>6042 4532 3678 9078</p>
              </span>
            </div>

            <button className="change_account">Change Account</button>
          </article>
        </section>
      </section>
    </section>
  );
}

export default Revenue;
