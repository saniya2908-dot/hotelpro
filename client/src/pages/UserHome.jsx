import { useEffect, useMemo, useState } from "react";
import api from "../api";
import UserNavbar from "../components/UserNavbar";
import BookingModal from "../components/PaymentModal";

const roomImages = {
  single: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85",
  double: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85",
  suite: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85",
};

const guestQuotes = [
  "A change of place can change your whole perspective.",
  "Make yourself at home, wherever you happen to be.",
  "The best trips leave you rested enough for what comes next.",
];

function UserHome() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [rooms, setRooms] = useState([]);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [roomType, setRoomType] = useState("all");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    api
      .get("/rooms/getrooms")
      .then((res) => setRooms(res.data))
      .catch(() => setMessage({ text: "Could not load rooms. Please refresh and try again.", type: "danger" }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setQuoteIndex((i) => (i + 1) % guestQuotes.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleRooms = useMemo(
    () => roomType === "all" ? rooms : rooms.filter((room) => room.type === roomType),
    [rooms, roomType]
  );

  const openBooking = (room) => {
    if (!fromdate || !todate) {
      setMessage({ text: "Choose your check-in and check-out dates first.", type: "warning" });
      return;
    }
    if (todate <= fromdate) {
      setMessage({ text: "Check-out must be after check-in.", type: "danger" });
      return;
    }
    setMessage({ text: "", type: "" });
    setSelectedRoom(room);
  };

  const bookRoom = async () => {
    if (!selectedRoom) return;
    try {
      const res = await api.post("/bookings/book", {
        roomId: selectedRoom._id,
        guestName: user?.name,
        fromdate,
        todate,
      });
      setMessage({
        text: `Booking confirmed. Total: ₹${Number(res.data.booking.totalAmount).toLocaleString("en-IN")}`,
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong. Please try again.",
        type: "danger",
      });
    }
    setSelectedRoom(null);
  };

  const [today] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]);

  return (
    <main className="customer-page">
      <UserNavbar />
      <header className="customer-top">
        <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>Find your kind of comfort{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1>
        <p>Pick your dates, explore the rooms and make your next stay yours.</p>
      </header>

      <div className="customer-content">
        <section className="booking-search-panel" aria-label="Choose stay dates">
          <div className="date-field">
            <label htmlFor="checkin-date">CHECK-IN</label>
            <input id="checkin-date" type="date" min={today} value={fromdate} onChange={(e) => setFromdate(e.target.value)} />
          </div>
          <div className="date-field">
            <label htmlFor="checkout-date">CHECK-OUT</label>
            <input id="checkout-date" type="date" min={fromdate || today} value={todate} onChange={(e) => setTodate(e.target.value)} />
          </div>
          <div className="date-field">
            <label htmlFor="room-type">ROOM STYLE</label>
            <select id="room-type" className="form-select" value={roomType} onChange={(e) => setRoomType(e.target.value)} style={{ borderRadius: 0, padding: "11px 12px", fontSize: 12 }}>
              <option value="all">All rooms</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>
        </section>

        {message.text && <div className={`alert alert-${message.type} mt-3`} role="status">{message.text}</div>}

        <section className="customer-section-heading">
          <div><h2>Explore rooms</h2><p>{visibleRooms.length} {visibleRooms.length === 1 ? "option" : "options"} to explore · Prices shown per night · Availability is confirmed when you book</p></div>
          <span className="eyebrow">COMFORT, CONSIDERED</span>
        </section>

        {visibleRooms.length ? (
          <div className="customer-room-grid">
            {visibleRooms.map((room, i) => (
              <article className="customer-room-card" key={room._id}>
                <img
                  src={room.photos?.[0] || roomImages[room.type] || roomImages.double}
                  alt={`${room.type} room ${room.roomNumber}`}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = roomImages.double; }}
                />
                <div className="customer-room-body">
                  <span className="room-type">{room.type} · ROOM {room.roomNumber || String(i + 1).padStart(2, "0")}</span>
                  <h3>{room.name || (room.type === "suite" ? "The Suite" : room.type === "double" ? "The Double" : "The Essential")}</h3>
                  <p>{room.description}</p>
                  <div className="customer-room-price">₹{Number(room.rent).toLocaleString("en-IN")} <span>/ night</span></div>
              <button className="customer-book-button" onClick={() => openBooking(room)}>Choose this room <span aria-hidden="true">↗</span></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="customer-empty">{rooms.length ? "No rooms match that style. Choose another room style to see more options." : "Rooms are loading or temporarily unavailable. Refresh this page in a moment."}</div>
        )}

        <section className="quote-banner" style={{ marginTop: 54, padding: "52px 24px" }} aria-live="polite">
          <span className="eyebrow eyebrow-light">A LITTLE TRAVEL THOUGHT</span>
          <blockquote style={{ fontSize: "clamp(25px, 3vw, 36px)", margin: "17px 0 0" }}>“{guestQuotes[quoteIndex]}”</blockquote>
          <div className="quote-dots" style={{ justifyContent: "center" }}>{guestQuotes.map((quote, i) => <button key={quote} aria-label={`Show thought ${i + 1}`} className={i === quoteIndex ? "active" : ""} onClick={() => setQuoteIndex(i)} />)}</div>
        </section>
      </div>

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          fromdate={fromdate}
          todate={todate}
          onClose={() => setSelectedRoom(null)}
          onConfirm={bookRoom}
        />
      )}
    </main>
  );
}

export default UserHome;
