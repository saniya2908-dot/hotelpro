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
        <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> YOUR TRAVEL, ALL IN ONE PLACE</span>
        <h1>Every stay, remembered.</h1>
        <p>Keep track of your upcoming plans and the stays you’ve already booked.</p>
      </header>
      <div className="customer-content">
        <section className="customer-section-heading">
          <div><h2>My bookings</h2><p>{bookings.length} {bookings.length === 1 ? "booking" : "bookings"} in your account</p></div>
          <Link className="button button-dark" to="/home">Find another stay <span>↗</span></Link>
        </section>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {loading ? (
          <div className="customer-empty">Loading your bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="booking-empty-panel">
            <span className="booking-empty-icon">✳</span>
            <h2>Your next story starts here.</h2>
            <p>You haven’t booked a stay yet. Explore the rooms and find a place to look forward to.</p>
            <Link className="button button-dark" to="/home">Explore rooms <span>↗</span></Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((b) => (
              <article className="booking-card" key={b._id}>
                <div className="booking-card-image">
                  <img src={b.room?.photos?.[0] || (b.room?.type === "suite" ? "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" : "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80")} alt={`${b.room?.type || "Hotel"} room`} loading="lazy" />
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
                    {b.status === "booked" && <button className="booking-cancel" onClick={() => cancel(b._id)}>Cancel booking</button>}
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
