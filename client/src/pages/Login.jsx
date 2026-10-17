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
          <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> WELCOME BACK</span>
          <h1>Your next stay<br /><em>is waiting.</em></h1>
          <p>“The journey feels better when you know where you’ll rest.”</p>
        </div>
        <span className="auth-visual-caption">A LITTLE MORE COMFORT. A LITTLE LESS EFFORT.</span>
      </section>
      <section className="auth-form-side">
        <Link className="auth-back" to="/">← Back to home</Link>
        <div className="auth-form-wrap">
          <span className="eyebrow"><span className="eyebrow-line" /> YOUR HOTELPRO ACCOUNT</span>
          <h2>Good to see you.</h2>
          <p className="auth-subtitle">Sign in to manage your stay and discover your next escape.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" className="form-control auth-input" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" className="form-control auth-input" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
            <button className="button button-dark auth-submit" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in to HotelPro"} <span>↗</span></button>
          </form>
          <p className="auth-switch">New to HotelPro? <Link to="/signup">Create an account</Link></p>
          <div className="auth-small-note">Your next chapter starts with a good night’s rest.</div>
        </div>
      </section>
    </main>
  );
}

export default Login;
