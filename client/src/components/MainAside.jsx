import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBiking,
  faDoorClosed,
  faDoorOpen,
  faMessage,
  faMoneyBill,
  faRightFromBracket,
  faShop,
  faTv,
} from "@fortawesome/free-solid-svg-icons";

import Logod from "../assets/logo_thriftify.svg";

function MainAside() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <aside className="main_aside">
      <div className="aside_logo">
        <Link to="/">
          <img src={Logod} alt="Thriftify Logo" />
        </Link>
      </div>

      <nav className="aside_nav">
        <Link to="/main" className="aside_link" aria-label="Marketplaces" title="Marketplaces">
          <FontAwesomeIcon icon={faShop} />
        </Link>
        <Link to="/main/performance" className="aside_link" aria-label="Performance" title="Performance">
          <FontAwesomeIcon icon={faTv} />
        </Link>
        <Link to="/main/reviews" className="aside_link" aria-label="Reviews" title="Reviews">
          <FontAwesomeIcon icon={faMessage} />
        </Link>
        <Link to="/main/revenue" className="aside_link" aria-label="Revenue" title="Revenue">
          <FontAwesomeIcon icon={faMoneyBill} />
        </Link>
        {/* <Link to="/main/orders" className="aside_link" aria-label="Orders" title="Orders">
          <FontAwesomeIcon icon={faBiking} />
        </Link> */}
        
      </nav>

      <div className="aside_spacer" />

      <div className="aside_bottom">
     

        <button
          type="button"
          className="aside_link logout_link"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
            <FontAwesomeIcon icon={faDoorClosed} className="door_closed" />
            <FontAwesomeIcon icon={faDoorOpen} className="door_open" />
        </button>
      </div>
    </aside>
  );
}

export default MainAside;
