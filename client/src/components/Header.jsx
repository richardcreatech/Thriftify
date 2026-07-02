import React from "react";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

function Header() {
  return (
    <header id="header">
      <img src={logo} alt="" />

      <nav>
        <ul>
          <li>
            <FontAwesomeIcon icon={faBagShopping} />
            <sup>5</sup>
          </li>
          <span>Lp</span>

        </ul>
      </nav>
    </header>
  );
}

export default Header;
