import "../styles/profile_card.css";

const dummyUser = {
  name: "Vance Joy",
  username: "@vjoy",
  avatar: "https://i.pravatar.cc/150?img=12",
};

export default function ProfileCard({ user = dummyUser }) {
  return (
    <div className="profile-card">
      <img
        className="profile-avatar"
        src={user.avatar}
        alt={user.name}
      />
      <div className="profile-info">
        <span className="profile-name">{user.name}</span>
        <span className="profile-username">{user.username}</span>
      </div>
    </div>
  );
}
