import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.type === "admin" ? "/admin" : "/home");
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link className="hotel-brand auth-brand" to="/"><span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>STAYS, MADE SPECIAL</small></span></Link>
        <div className="auth-visual-copy">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> YOUR PLACE IS HERE</span>
          <h1>Your next little escape<br /><em>is waiting.</em></h1>
          <p>“Come back to a place that feels calm, familiar and entirely yours.”</p>
        </div>
        <span className="auth-visual-caption">A LITTLE MORE EASE. A LITTLE MORE YOU.</span>
      </section>
      <section className="auth-form-side">
        <Link className="auth-back" to="/">← Back to home</Link>
        <div className="auth-form-wrap">
          <span className="eyebrow"><span className="eyebrow-line" /> WELCOME BACK TO YOUR SPACE</span>
          <h2>Lovely to have you back.</h2>
          <p className="auth-subtitle">Sign in to revisit your bookings and find a little inspiration for your next getaway.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" className="form-control auth-input" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" className="form-control auth-input" name="password" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={handleChange} required />
            <button className="button button-dark auth-submit" type="submit" disabled={loading}>{loading ? "Signing in…" : "Let me in"} <span>↗</span></button>
          </form>
          <p className="auth-switch">New to HotelPro? <Link to="/signup">Create an account</Link></p>
          <p className="auth-switch admin-login-link"><Link to="/admin-login">Administrator sign in</Link></p>
          <div className="auth-small-note">Your next beautiful memory is just around the corner.</div>
        </div>
      </section>
    </main>
  );
}

export default Login;
