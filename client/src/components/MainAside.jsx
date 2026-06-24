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
} from "@fortawesome/free-solid-svg-icons";

import Logod from "../assets/logo_thriftify.svg";

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

        {/* Revenue */}
        <Link to="/main/revenue" className="aside_link">
          <FontAwesomeIcon icon={faTv} />
        </Link>


        {/* Performance */}
        <Link to="/main/performance" className="aside_link">
          <FontAwesomeIcon icon={faBell} />
        </Link>

        {/* No route yet */}
        <Link to="/main" className="aside_link">
          <FontAwesomeIcon icon={faIdBadge} />
        </Link>

        {/* No route yet */}
        <Link to="/main" className="aside_link">
          <FontAwesomeIcon icon={faAnchor} />
        </Link>
      </nav>

      {/* Pushes bottom section down */}
      <div className="aside_spacer"></div>

      {/* Bottom Navigation */}
      <nav className="aside_nav bottom_nav">
        <Link to="/" className="aside_link">
          <FontAwesomeIcon icon={faPhone} />
        </Link>

        <Link to="/" className="aside_link">
          <FontAwesomeIcon icon={faGear} />
        </Link>
      </nav>
    </aside>
  );
}

export default MainAside;
