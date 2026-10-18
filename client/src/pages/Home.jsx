import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const CURRENT_YEAR = new Date().getFullYear();

const quotes = [
  { line: "A change of place can change the pace of everything.", author: "A fresh perspective", style: "minimal" },
  { line: "Come for the comfort; take home the moments.", author: "Stay beyond the ordinary", style: "serif" },
  { line: "Some of the best plans begin with checking in.", author: "Your next chapter", style: "italic" },
  { line: "Find a place to pause, recharge, and feel at home.", author: "A slower kind of escape", style: "serif" },
];

const roomImages = {
  single: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
  double: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  suite: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
};

const experiences = [
  { icon: "✦", title: "Comfort in every corner", copy: "Settle into inviting spaces designed for restful nights, easy mornings, and time well spent." },
  { icon: "⌁", title: "Your stay, made simple", copy: "Compare your options, select the dates that suit you, and organise your getaway in a few steps." },
  { icon: "♡", title: "Clarity from the start", copy: "Straightforward rates and the essentials you need help you plan with confidence before arrival." },
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
          <h1>Your next escape<br /><em>starts right here.</em></h1>
          <p>Discover welcoming rooms, considered details, and a comfortable place to step away from the usual routine.</p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/signup">Find your retreat <span>↗</span></Link>
            <Link className="hero-text-link" to="/login">Already have an account? <u>Sign in</u></Link>
          </div>
          <div className="hero-caption"><span>01 / 04</span><span>MAKE TIME FOR A CHANGE</span><span>✳</span></div>
        </div>
        <aside className={`quote-card quote-${quotes[quoteIndex].style}`} aria-live="polite">
          <span className="quote-mark">“</span>
          <p>{quotes[quoteIndex].line}</p>
          <small>{quotes[quoteIndex].author}</small>
          <div className="quote-dots">{quotes.map((q, i) => <button key={q.line} aria-label={`Show quote ${i + 1}`} className={i === quoteIndex ? "active" : ""} onClick={() => setQuoteIndex(i)} />)}</div>
        </aside>
      </section>

      <section className="trust-strip" aria-label="HotelPro benefits">
        <div><strong>01</strong><span>Simple room reservations</span></div>
        <div><strong>02</strong><span>Comfort for every guest</span></div>
        <div><strong>03</strong><span>Upfront room rates</span></div>
        <div><strong>04</strong><span>Space to make your own</span></div>
      </section>

      <section className="section-wrap rooms-section" id="rooms">
        <div className="section-heading">
          <div><span className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FAVOURITE</span><h2>Find a room that <em className="fall-in-love-highlight"><strong>fits your getaway.</strong></em></h2></div>
          <Link className="underlined-link" to="/signup">Explore the collection <span>↗</span></Link>
        </div>
        <p className="section-intro">Planning a short break or marking an important occasion? Browse inviting spaces that suit your plans, your pace, and your budget.</p>
        <div className="room-grid">
          {(rooms.length ? rooms.slice(0, 6) : [
            { _id: "single-preview", type: "single", roomNumber: "01", description: "A practical, peaceful room for a restful night.", rent: 1500 },
            { _id: "double-preview", type: "double", roomNumber: "02", description: "Extra room to relax and enjoy time together.", rent: 2500 },
            { _id: "suite-preview", type: "suite", roomNumber: "03", description: "A spacious setting for a more special stay.", rent: 4000 },
          ]).map((room, i) => (
            <article className="room-card" key={room._id}>
              <div className="room-image-wrap">
                <img src={room.photos?.[0] || roomImages[room.type] || roomImages.double} alt={`${room.type} hotel room`} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = roomImages.double; }} />
                <span className="room-number">STAY 0{i + 1}</span>
              </div>
              <div className="room-card-body">
                <div className="room-type-row"><span className="room-type">{room.type} room</span><span className="room-rating">✦ Guest favourite</span></div>
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
        <div className="experience-image"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Warm, thoughtfully designed hotel room" loading="lazy" /><div className="image-note"><span>THE HOTELPRO EXPERIENCE</span><strong>Make yourself at home.</strong></div></div>
        <div className="experience-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> DETAILS THAT MAKE A DIFFERENCE</span>
          <h2>Settle in.<br /><em>Leave refreshed.</em></h2>
          <p className="experience-lead">A memorable visit does not need to be complicated: a comfortable room, a peaceful start to the day, and room to enjoy your time away.</p>
          <div className="experience-list">{experiences.map((item) => <div className="experience-item" key={item.title}><span className="experience-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></div>)}</div>
          <Link className="underlined-link" to="/signup">Find your kind of lovely <span>↗</span></Link>
        </div>
      </section>


      <section className="moment-section" aria-labelledby="moment-heading">
        <div className="moment-heading">
          <span className="eyebrow"><span className="eyebrow-line" /> A STAY THAT MATCHES YOUR MOOD</span>
          <h2 id="moment-heading">What would make <em>your stay special?</em></h2>
          <p>Choose a stay for a restful break, a meaningful celebration, or simply a chance to see somewhere familiar with fresh eyes.</p>
        </div>
        <div className="moment-grid">
          <article className="moment-card">
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85" alt="A peaceful bedroom with soft natural light" loading="lazy" />
            <span className="moment-number">01</span>
            <div className="moment-card-copy"><span>THE PEACEFUL BREAK</span><h3>Take the day slowly.</h3><p>A quiet base for late breakfasts, a favourite book, and an easy pace.</p></div>
          </article>
          <article className="moment-card">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85" alt="A warmly styled boutique hotel living space" loading="lazy" />
            <span className="moment-number">02</span>
            <div className="moment-card-copy"><span>THE SPECIAL OCCASION</span><h3>Give it a setting.</h3><p>Mark birthdays, milestones, and shared moments in a place of your own.</p></div>
          </article>
          <article className="moment-card">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85" alt="A calm, softly decorated room for a restful stay" loading="lazy" />
            <span className="moment-number">03</span>
            <div className="moment-card-copy"><span>THE CHANGE OF SCENE</span><h3>Step out of routine.</h3><p>Make room for a calmer day and return with a clearer head.</p></div>
          </article>
        </div>
        <div className="moment-note"><span>♡</span> Make your time away your own <span>♡</span></div>
      </section>

      <section className="quote-banner">
        <span className="quote-banner-flower">✳</span>
        <span className="eyebrow eyebrow-light">A THOUGHT BEFORE YOU GO</span>
        <blockquote>“Leave a little room in your plans for rest.<br /><em>Sometimes a new view is all the refresh you need.</em>”</blockquote>
        <Link className="button button-gold" to="/signup">Your escape begins here <span>↗</span></Link>
      </section>

      <footer className="hotel-footer">
        <Link className="hotel-brand footer-brand" to="/"><span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>STAYS, MADE SPECIAL</small></span></Link>
        <p>A comfortable place to begin again.</p>
        <div><Link to="/login">Sign in</Link><Link to="/signup">Create account</Link><a href="#rooms">Explore rooms</a></div>
        <small>© {CURRENT_YEAR} HotelPro. Find the room that suits your next stay.</small>
      </footer>
    </main>
  );
}

export default Home;
