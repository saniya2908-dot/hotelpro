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
  single: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
  double: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  suite: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
};

const experiences = [
  { icon: "✦", title: "Spaces with a softer touch", copy: "Warm, welcoming rooms made for slow mornings, peaceful evenings and everything in between." },
  { icon: "⌁", title: "A little ease, all the way", copy: "Choose your dates, find your favourite room and let the details fall into place." },
  { icon: "♡", title: "The little things count", copy: "Transparent prices and thoughtful essentials, so you can look forward to your stay with ease." },
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
          <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> YOUR LITTLE ESCAPE AWAITS</span>
          <h1>Find a little<br /><em>somewhere lovely.</em></h1>
          <p>Soft details, soulful spaces, and thoughtful comforts—your own little pause from the everyday.</p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/signup">Find your retreat <span>↗</span></Link>
            <Link className="hero-text-link" to="/login">Already have an account? <u>Sign in</u></Link>
          </div>
          <div className="hero-caption"><span>01 / 04</span><span>A MOMENT JUST FOR YOU</span><span>✳</span></div>
        </div>
        <aside className={`quote-card quote-${quotes[quoteIndex].style}`} aria-live="polite">
          <span className="quote-mark">“</span>
          <p>{quotes[quoteIndex].line}</p>
          <small>{quotes[quoteIndex].author}</small>
          <div className="quote-dots">{quotes.map((q, i) => <button key={q.line} aria-label={`Show quote ${i + 1}`} className={i === quoteIndex ? "active" : ""} onClick={() => setQuoteIndex(i)} />)}</div>
        </aside>
      </section>

      <section className="trust-strip" aria-label="HotelPro benefits">
        <div><strong>01</strong><span>Effortless reservations</span></div>
        <div><strong>02</strong><span>Beautifully restful rooms</span></div>
        <div><strong>03</strong><span>Thoughtful, clear pricing</span></div>
        <div><strong>04</strong><span>A stay that feels yours</span></div>
      </section>

      <section className="section-wrap rooms-section" id="rooms">
        <div className="section-heading">
          <div><span className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FAVOURITE</span><h2>A little room to <em className="fall-in-love-highlight">fall in love with.</em></h2></div>
          <Link className="underlined-link" to="/signup">Explore the collection <span>↗</span></Link>
        </div>
        <p className="section-intro">From a quiet weekend away to a special celebration, discover a space that matches your mood and makes every moment feel considered.</p>
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
        <div className="experience-image"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Warm, thoughtfully designed hotel room" loading="lazy" /><div className="image-note"><span>THE HOTELPRO FEEL</span><strong>Space to slow down.</strong></div></div>
        <div className="experience-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> MADE FOR YOUR MOMENTS</span>
          <h2>Stay awhile.<br /><em>Feel wonderful.</em></h2>
          <p className="experience-lead">The loveliest stays are made of little things: a calming room, a slower morning and the feeling that you can simply be.</p>
          <div className="experience-list">{experiences.map((item) => <div className="experience-item" key={item.title}><span className="experience-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></div>)}</div>
          <Link className="underlined-link" to="/signup">Find your kind of lovely <span>↗</span></Link>
        </div>
      </section>


      <section className="moment-section" aria-labelledby="moment-heading">
        <div className="moment-heading">
          <span className="eyebrow"><span className="eyebrow-line" /> A STAY THAT MATCHES YOUR MOOD</span>
          <h2 id="moment-heading">What kind of <em>moment do you need?</em></h2>
          <p>Whether you’re celebrating something special or simply craving a change of scene, let your next stay feel a little more personal.</p>
        </div>
        <div className="moment-grid">
          <article className="moment-card">
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85" alt="A peaceful bedroom with soft natural light" loading="lazy" />
            <span className="moment-number">01</span>
            <div className="moment-card-copy"><span>THE SLOW MORNING</span><h3>Room to exhale.</h3><p>For unhurried mornings, a good book and nowhere else to be.</p></div>
          </article>
          <article className="moment-card">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85" alt="A warmly styled boutique hotel living space" loading="lazy" />
            <span className="moment-number">02</span>
            <div className="moment-card-copy"><span>THE LITTLE CELEBRATION</span><h3>Make it memorable.</h3><p>For birthdays, milestones and moments worth holding close.</p></div>
          </article>
          <article className="moment-card">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85" alt="A calm, softly decorated room for a restful stay" loading="lazy" />
            <span className="moment-number">03</span>
            <div className="moment-card-copy"><span>THE QUIET RESET</span><h3>Your own little world.</h3><p>For a peaceful pause and a fresh perspective.</p></div>
          </article>
        </div>
        <div className="moment-note"><span>♡</span> Your time away should feel like you <span>♡</span></div>
      </section>

      <section className="quote-banner">
        <span className="quote-banner-flower">✳</span>
        <span className="eyebrow eyebrow-light">A LITTLE NOTE FOR YOU</span>
        <blockquote>“Make space for softer mornings.<br /><em>Let your next chapter begin somewhere beautiful.</em>”</blockquote>
        <Link className="button button-gold" to="/signup">Your escape begins here <span>↗</span></Link>
      </section>

      <footer className="hotel-footer">
        <Link className="hotel-brand footer-brand" to="/"><span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>STAYS, MADE SPECIAL</small></span></Link>
        <p>A softer place to land.</p>
        <div><Link to="/login">Sign in</Link><Link to="/signup">Create account</Link><a href="#rooms">Explore rooms</a></div>
        <small>© {CURRENT_YEAR} HotelPro. Thoughtfully made for your next getaway.</small>
      </footer>
    </main>
  );
}

export default Home;
