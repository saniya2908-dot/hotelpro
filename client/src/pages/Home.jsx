import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const CURRENT_YEAR = new Date().getFullYear();

const quotes = [
  { line: "Where every stay becomes a story.", author: "The art of getting away", style: "serif" },
  { line: "Arrive as a guest. Leave with memories.", author: "A little more than a room", style: "italic" },
  { line: "Good days start with a beautiful stay.", author: "Make room for something wonderful", style: "minimal" },
  { line: "Your next favourite place is closer than you think.", author: "Find your somewhere", style: "serif" },
];

const roomImages = {
  single: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85",
  double: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85",
  suite: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85",
};

const experiences = [
  { icon: "✦", title: "Thoughtfully chosen stays", copy: "Comfort-first rooms for quick getaways, work trips and longer escapes." },
  { icon: "⌁", title: "A simpler way to book", copy: "Choose your dates, explore your options and reserve in just a few steps." },
  { icon: "♡", title: "The details matter", copy: "Clear nightly pricing and the essentials you need before you arrive." },
];

function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 4200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get("/rooms/getrooms").then((res) => setRooms(res.data)).catch(() => {});
  }, []);

  return (
    <main className="hotel-site">
      <nav className="hotel-nav">
        <Link className="hotel-brand" to="/" aria-label="HotelPro home">
          <span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>STAYS, MADE SPECIAL</small></span>
        </Link>
        <div className="hotel-nav-links">
          <a href="#rooms">Our rooms</a>
          <a href="#experience">The experience</a>
        </div>
        <div className="hotel-nav-actions">
          <Link className="nav-login" to="/login">Log in</Link>
          <Link className="button button-dark" to="/signup">Find a stay <span>↗</span></Link>
        </div>
      </nav>

      <section className="hero-luxe">
        <div className="hero-photo" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> A BETTER WAY TO GET AWAY</span>
          <h1>Stay somewhere<br /><em>that feels like you.</em></h1>
          <p>Beautiful spaces. Thoughtful comfort. A smoother journey from check-in to check-out.</p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/signup">Explore stays <span>↗</span></Link>
            <Link className="hero-text-link" to="/login">Already have an account? <u>Sign in</u></Link>
          </div>
          <div className="hero-caption"><span>01 / 04</span><span>YOUR SPACE TO UNWIND</span><span>✳</span></div>
        </div>
        <aside className={`quote-card quote-${quotes[quoteIndex].style}`} aria-live="polite">
          <span className="quote-mark">“</span>
          <p>{quotes[quoteIndex].line}</p>
          <small>{quotes[quoteIndex].author}</small>
          <div className="quote-dots">{quotes.map((q, i) => <button key={q.line} aria-label={`Show quote ${i + 1}`} className={i === quoteIndex ? "active" : ""} onClick={() => setQuoteIndex(i)} />)}</div>
        </aside>
      </section>

      <section className="trust-strip" aria-label="HotelPro benefits">
        <div><strong>01</strong><span>Easy online booking</span></div>
        <div><strong>02</strong><span>Comfort-led spaces</span></div>
        <div><strong>03</strong><span>Clear nightly rates</span></div>
        <div><strong>04</strong><span>Your stay, your way</span></div>
      </section>

      <section className="section-wrap rooms-section" id="rooms">
        <div className="section-heading">
          <div><span className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FIT</span><h2>A room for <em>every kind of trip.</em></h2></div>
          <Link className="underlined-link" to="/signup">See stays & book <span>↗</span></Link>
        </div>
        <p className="section-intro">From a restful night between meetings to a little extra space to celebrate, find the stay that suits your plans.</p>
        <div className="room-grid">
          {(rooms.length ? rooms.slice(0, 6) : [
            { _id: "single-preview", type: "single", roomNumber: "01", description: "A calm, comfortable space to recharge.", rent: 1500 },
            { _id: "double-preview", type: "double", roomNumber: "02", description: "Room to settle in and share the stay.", rent: 2500 },
            { _id: "suite-preview", type: "suite", roomNumber: "03", description: "More space for the moments that matter.", rent: 4000 },
          ]).map((room, i) => (
            <article className="room-card" key={room._id}>
              <div className="room-image-wrap">
                <img src={room.photos?.[0] || roomImages[room.type] || roomImages.double} alt={`${room.type} hotel room`} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = roomImages.double; }} />
                <span className="room-number">STAY 0{i + 1}</span>
              </div>
              <div className="room-card-body">
                <div className="room-type-row"><span className="room-type">{room.type} room</span><span className="room-rating">✦ Comfort pick</span></div>
                <h3>{room.name || (room.type === "suite" ? "The Suite" : room.type === "double" ? "The Double" : "The Essential")}</h3>
                <p>{room.description}</p>
                <div className="room-card-bottom"><div><strong>₹{Number(room.rent).toLocaleString("en-IN")}</strong><span> / night</span></div><Link to="/login" aria-label={`Book ${room.type} room`}>↗</Link></div>
              </div>
            </article>
          ))}
        </div>
        <div className="center-action"><Link className="button button-outline" to="/signup">Explore all available stays <span>↗</span></Link></div>
      </section>

      <section className="experience-section" id="experience">
        <div className="experience-image"><img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85" alt="Warm, thoughtfully designed hotel room" loading="lazy" /><div className="image-note"><span>THE HOTELPRO FEEL</span><strong>Space to slow down.</strong></div></div>
        <div className="experience-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> THE LITTLE THINGS</span>
          <h2>Travel well.<br /><em>Feel at home.</em></h2>
          <p className="experience-lead">A great stay is more than a place to sleep. It is the ease of knowing the details are taken care of.</p>
          <div className="experience-list">{experiences.map((item) => <div className="experience-item" key={item.title}><span className="experience-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></div>)}</div>
          <Link className="underlined-link" to="/signup">Make your next stay count <span>↗</span></Link>
        </div>
      </section>

      <section className="quote-banner">
        <span className="quote-banner-flower">✳</span>
        <span className="eyebrow eyebrow-light">A NOTE TO THE TRAVELLER</span>
        <blockquote>“Collect moments, not just miles.<br /><em>We’ll help with the place to stay.</em>”</blockquote>
        <Link className="button button-gold" to="/signup">Your next stay starts here <span>↗</span></Link>
      </section>

      <footer className="hotel-footer">
        <Link className="hotel-brand footer-brand" to="/"><span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>STAYS, MADE SPECIAL</small></span></Link>
        <p>Make room for a better stay.</p>
        <div><Link to="/login">Sign in</Link><Link to="/signup">Create account</Link><a href="#rooms">Explore rooms</a></div>
        <small>© {CURRENT_YEAR} HotelPro. Made for the way you travel.</small>
      </footer>
    </main>
  );
}

export default Home;
