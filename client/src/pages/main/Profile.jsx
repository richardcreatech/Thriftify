import React, { useEffect, useState } from "react";
import "../../styles/profile_page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHeart } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const [user, setUser] = useState("");

  useEffect(() => {
    async function get_sellers_profile() {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:5000/auth/get_seller_profile`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        const {
          display_name,
          username,
          bio,
          location,
          is_verified,
          profile_picture,
          cover_photo,
          total_products,
          total_sales,
          phone_number,
          status,
          createdAt,
          markets,
          bank_details
        } = data.seller;

        const user = {
          storeName: display_name,
          username,
          bio,
          location: location?.country,
          verified: is_verified,
          avatar: profile_picture,
          banner: cover_photo,
          totalProducts: total_products,
          totalSales: total_sales,
          phoneNumber: phone_number,
          marketplaces: markets.length,
          bank_details: bank_details,
          status : status,
       
        };

        setUser(user);
      } catch (err) {
        console.log(err);
      }
    }
    get_sellers_profile();
  }, []);

  return (
    <section id="profile_page">
      <div id="layer_2">
        <article className="my_info">
          <h2>Total Products</h2>
          <h1>{user.totalProducts}</h1>
        </article>

        <article className="my_info">
          <h2>Total Sales</h2>
          <h1>{user.totalSales}</h1>
        </article>

        <article className="my_info">
          <h2>My Markets</h2>
          <h1>{user.marketplaces}</h1>
        </article>
      </div>
      <div id="layer_1">
        <article>
          <img
            src={user.avatar || "https://shorturl.at/KFqta"}
            width={70}
            alt=""
          />
        </article>
        <article className="verified">
          <h2>{user.username}</h2>
          <small>
            {user.verified && <FontAwesomeIcon icon={faShieldHeart} />}{" "}
            {user.storeName}
          </small>
          <p>{user.bio}</p>
        </article>
        <article className="payment_card">
          {/* ── ATM Card face ── */}
          <div className="atm_card">
            <div className="atm_card__shine" />
            <div className="atm_card__shine atm_card__shine--2" />

            <div className="atm_card__top">
              <span className="atm_card__bank">{user?.bank_details?.bank_name}</span>
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
              <span className="atm_card__number">{user?.bank_details?.account_number}</span>
            </div>

            <div className="atm_card__bottom">
              <div>
                <p className="atm_card__holder_label">Card holder</p>
                <p className="atm_card__holder_name">{user?.bank_details?.account_name}</p>
              </div>
              {user?.verified && <div className="atm_card__status">
                <span className="atm_card__status_dot" />
                <span className="atm_card__status_text">Verified</span>
              </div>}
            </div>
          </div>

          {/* ── Info rows ── */}

          {/* ── Edit button ── */}
        </article>
      </div>
    </section>
  );
}

export default Profile;
