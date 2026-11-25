import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/profile_card.css";

function ProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/auth/get_seller_profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setUser({
        name: data.seller.display_name,
        username: data.seller.username,
        avatar: data.seller.profile_picture?.url,
      });
    };

    getProfile();
  }, []);

  if (!user) return null;

  return (
    <Link to="/main/profile" className="profile-card">
      <img
        className="profile-avatar"
        src={user.avatar}
        alt={user.name}
      />

      <div className="profile-info">
        <span className="profile-name">{user.name}</span>
        <span className="profile-username">@{user.username}</span>
      </div>
    </Link>
  );
}

export default ProfileCard