import { Link, useNavigate } from "react-router-dom";

function UserNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="hotel-nav customer-nav">
      <Link className="hotel-brand" to="/home" aria-label="HotelPro rooms">
        <span className="brand-mark">H</span>
        <span>hotel<span className="brand-light">pro</span><small>STAYS, MADE SPECIAL</small></span>
      </Link>
      <div className="hotel-nav-actions">
        <Link className="nav-login" to="/home">Explore rooms</Link>
        <Link className="nav-login" to="/mybookings">My bookings</Link>
        <span className="nav-login customer-greeting">Hi, {user?.name?.split(" ")[0] || "Guest"}</span>
        <button className="button button-dark" onClick={logout}>Log out <span>↗</span></button>
      </div>
    </nav>
  );
}

export default UserNavbar;
