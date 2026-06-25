return (
  <section id="profile_page">
    {/* <section id="profile_page"> */}
    <div className="profile_card">
      <img
        src={
          user.avatar ||
          "https://i.pinimg.com/1200x/04/3c/8f/043c8f8d3f7103f35a215730b020ad5d.jpg"
        }
        width={50}
        alt=""
      />
      <article>
        <h1>{user.storeName}</h1>
        <h2>
          {user.verified && <FontAwesomeIcon icon={faShieldHeart} />} Unverified
        </h2>
        <p>{user.bio}</p>
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
        <p>{user.totalProducts}</p>
      </article>
      <article className="info_card sales">
        <h2>Total Sales</h2>
        <p>{user.totalSales}</p>
      </article>
      <article className="info_card marketplaces">
        <h2>Total Marketplaces</h2>
        <p>30</p>
      </article>
    </div>
  </section>
);
