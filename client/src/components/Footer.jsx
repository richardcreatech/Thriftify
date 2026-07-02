import { Link } from "react-router-dom";
import {
  faHouse,
  faStore,
  faCompass,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <footer id="bottom_nav">
      <Link to="/" end>
        <FontAwesomeIcon icon={faHouse} />
        <span>Home</span>
      </Link>

      <Link to="/marketplace">
        <FontAwesomeIcon icon={faStore} />
        <span>Marketplace</span>
      </Link>

      <Link to="/discover">
        <FontAwesomeIcon icon={faCompass} />
        <span>Discover</span>
      </Link>

      <Link to="/following">
        <FontAwesomeIcon icon={faHeart} />
        <span>Following</span>
      </Link>

      <Link to="/profile">
        <FontAwesomeIcon icon={faUser} />
        <span>Profile</span>
      </Link>
    </footer>
  );
}

export default Footer;