import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", cpassword: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.cpassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        type: "customer",
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-signup-page">
      <section className="auth-visual">
        <Link className="hotel-brand auth-brand" to="/"><span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>STAYS, MADE SPECIAL</small></span></Link>
        <div className="auth-visual-copy">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> YOUR STORY, YOUR STAY</span>
          <h1>There’s a place<br /><em>for you here.</em></h1>
          <p>“Take the scenic route. Find a room that feels right. Make a memory.”</p>
        </div>
        <span className="auth-visual-caption">YOUR NEXT GETAWAY BEGINS HERE.</span>
      </section>
      <section className="auth-form-side">
        <Link className="auth-back" to="/">← Back to home</Link>
        <div className="auth-form-wrap">
          <span className="eyebrow"><span className="eyebrow-line" /> JOIN HOTELPRO</span>
          <h2>Make yourself at home.</h2>
          <p className="auth-subtitle">Create an account to explore rooms and keep your bookings in one place.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" className="form-control auth-input" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            <label htmlFor="signup-email">Email address</label>
            <input id="signup-email" className="form-control auth-input" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            <label htmlFor="signup-phone">Phone number</label>
            <input id="signup-phone" className="form-control auth-input" name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" value={form.phone} onChange={handleChange} required />
            <div className="auth-two-fields">
              <div><label htmlFor="signup-password">Password</label><input id="signup-password" className="form-control auth-input" name="password" type="password" autoComplete="new-password" placeholder="Create password" value={form.password} onChange={handleChange} required /></div>
              <div><label htmlFor="signup-confirm">Confirm password</label><input id="signup-confirm" className="form-control auth-input" name="cpassword" type="password" autoComplete="new-password" placeholder="Repeat password" value={form.cpassword} onChange={handleChange} required /></div>
            </div>
            <button className="button button-dark auth-submit" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create your account"} <span>↗</span></button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          <div className="auth-small-note">Thoughtful stays start with a simple hello.</div>
        </div>
      </section>
    </main>
  );
}

export default Signup;
