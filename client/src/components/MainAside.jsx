import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTv,
  faIdBadge,
  faPhone,
  faGear,
  faHouse,
  faAnchor,
  faBell,
  faUser,
  faChartBar,
  faBarChart,
  faBiking,
  faMessage,
  faShop,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

import Logod from "../assets/logo_thriftify.svg";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";

function MainAside() {
  return (
    <aside className="main_aside">
      {/* Logo */}
      <div className="aside_logo">
        <Link to="/">
          <img src={Logod} alt="Thriftify Logo" />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="aside_nav">
        {/* Dashboard (index route) */}
        <Link to="/main" className="aside_link active">
          <FontAwesomeIcon icon={faHouse} />
        </Link>

        {/* Performance */}
        <Link to="/main/performance" className="aside_link">
          <FontAwesomeIcon icon={faTv} />
        </Link>

        {/* Revenue */}
        <Link to="/main/revenue" className="aside_link">
          <FontAwesomeIcon icon={faMoneyBill} />
        </Link>

        {/* No route yet */}
        <Link to="/main/orders" className="aside_link">
          <FontAwesomeIcon icon={faBiking} />
        </Link>

        {/* No route yet */}
        <Link to="/main/reviews" className="aside_link">
          <FontAwesomeIcon icon={faMessage} />
        </Link>
      </nav>

      {/* Pushes bottom section down */}
      <div className="aside_spacer"></div>

      {/* Bottom Navigation */}
      <nav className="aside_nav bottom_nav">
        <Link to="/" className="aside_link">
          <FontAwesomeIcon icon={faShop} />
        </Link>

        <Link to="/" className="aside_link">
          <FontAwesomeIcon icon={faProductHunt} />
        </Link>
      </nav>
    </aside>
  );
}

export default MainAside;
