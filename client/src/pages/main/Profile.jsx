import React from "react";
import "../../styles/profile_page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHeart } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const user = {
    storeName: "Richard's Store",
    username: "richard_store",
    bio: "Affordable thrift fashion and vintage clothing.",
    location: "Lagos, Nigeria",
    verified: true,
    joinedAt: "March 2026",
    avatar: "...",
    banner: "...",
  };
  return (
    <section id="profile_page">
      {/* <section id="profile_page"> */}
          <div className="profile_card">
              <img src={"https://i.pinimg.com/1200x/cd/53/a2/cd53a20f27ccacb995bd3a8a8fdbfd9d.jpg"} width={50} alt="" />
              <article>
                  <h1>Love Bug</h1>
                  <h2><FontAwesomeIcon icon={faShieldHeart} /> Unverified</h2>
                  <p>Building products that solve real problems. Focused on quality, transparency, and creating value for every customer.</p>
              </article>
   </div>

      <div className="payment_card">
        {/* ── ATM Card face ── */}
        <div className="atm_card">
          <div className="atm_card__shine" />
          <div className="atm_card__shine atm_card__shine--2" />

          <div className="atm_card__top">
            <span className="atm_card__bank">Opay</span>
            <div className="atm_card__logo">
              <div className="atm_card__logo_inner" />
            </div>
          </div>

          <div className="atm_card__mid">
            <div className="atm_chip">
              <div className="atm_chip__row" />
              <div className="atm_chip__row atm_chip__row--split">
                <div className="atm_chip__cell" />
                <div className="atm_chip__gap" />
                <div className="atm_chip__cell" />
              </div>
              <div className="atm_chip__row" />
            </div>
            <span className="atm_card__number">•••• •••• •••• 1234</span>
          </div>

          <div className="atm_card__bottom">
            <div>
              <p className="atm_card__holder_label">Card holder</p>
              <p className="atm_card__holder_name">Richard Doe</p>
            </div>
            <div className="atm_card__status">
              <span className="atm_card__status_dot" />
              <span className="atm_card__status_text">Verified</span>
            </div>
          </div>
        </div>

        {/* ── Info rows ── */}

        {/* ── Edit button ── */}
        <button className="payment_edit_btn">Edit Details</button>
      </div>

          <div className="stats_card">
              <article className="info_card product">
                  <h2>Total Product</h2>
                  <p>50</p>
          </article>
              <article className="info_card sales">
                  <h2>Total Sales</h2>
                  <p>50</p>
          </article>
              <article className="info_card marketplaces">
                  <h2>Total Marketplaces</h2>
                  <p>50</p>
          </article>
      </div>
    
    </section>
  );
}

export default Profile;
