import "../styles/notification.css";

function Notification({ message , type }) {
    if (!message) return null;

 return (
  <div className={`notification ${type}`}>
    <span className="notification-dot"></span>
    <p>{message}</p>
  </div>
);
}

export default Notification;
