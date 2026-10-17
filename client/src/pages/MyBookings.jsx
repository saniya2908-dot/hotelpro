import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import UserNavbar from "../components/UserNavbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    api
      .get("/bookings/mybookings")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Could not load bookings. Please refresh and try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancel = async (bookingId) => {
    try {
      await api.post("/bookings/cancelbooking", { bookingId });
      setError("");
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel this booking.");
    }
  };

  return (
    <main className="customer-page">
      <UserNavbar />
      <header className="customer-top">
        <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> ALL YOUR LITTLE GETAWAYS</span>
        <h1>Every lovely stay, in one place.</h1>
        <p>Your upcoming escapes and past stays, gathered neatly in one place.</p>
      </header>
      <div className="customer-content">
        <section className="customer-section-heading">
          <div><h2>My stays</h2><p>{bookings.length} {bookings.length === 1 ? "booking" : "bookings"} in your account</p></div>
          <Link className="button button-dark" to="/home">Plan another escape <span>↗</span></Link>
        </section>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {loading ? (
          <div className="customer-empty">Loading your bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="booking-empty-panel">
            <span className="booking-empty-icon">✳</span>
            <h2>Your next little escape starts here.</h2>
            <p>Nothing booked just yet. Browse the rooms and find somewhere lovely to look forward to.</p>
            <Link className="button button-dark" to="/home">Find your retreat <span>↗</span></Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((b) => (
              <article className="booking-card" key={b._id}>
                <div className="booking-card-image">
                  <img src={b.room?.photos?.[0] || (b.room?.type === "suite" ? "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85" : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85")} alt={`${b.room?.type || "Hotel"} room`} loading="lazy" />
                </div>
                <div className="booking-card-details">
                  <span className="room-type">{b.room?.type || "Hotel"} · ROOM {b.room?.roomNumber || "—"}</span>
                  <h3>{b.room?.type === "suite" ? "The Suite" : b.room?.type === "double" ? "The Double" : "The Essential"}</h3>
                  <div className="booking-dates">
                    <div><small>CHECK-IN</small><strong>{new Date(b.fromdate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></div>
                    <span className="booking-date-arrow">→</span>
                    <div><small>CHECK-OUT</small><strong>{new Date(b.todate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></div>
                  </div>
                  <div className="booking-card-bottom">
                    <div><small>TOTAL STAY</small><strong>₹{Number(b.totalAmount).toLocaleString("en-IN")}</strong></div>
                    <span className={`booking-status ${b.status === "booked" ? "status-booked" : "status-cancelled"}`}>{b.status}</span>
                    {b.status === "booked" && <button className="booking-cancel" onClick={() => cancel(b._id)}>Cancel this stay</button>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;
