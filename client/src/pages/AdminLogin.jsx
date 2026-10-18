import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/admin-login", form);
      if (response.data?.user?.type !== "admin" || !response.data?.token) {
        throw new Error("The server did not return an administrator session.");
      }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Administrator sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page admin-login-page">
      <section className="auth-visual">
        <Link className="hotel-brand auth-brand" to="/"><span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>ADMINISTRATION</small></span></Link>
        <div className="auth-visual-copy">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-line" /> HOTEL MANAGEMENT</span>
          <h1>Every detail,<br /><em>beautifully managed.</em></h1>
          <p>Manage room inventory and oversee hotel operations from one secure workspace.</p>
        </div>
        <span className="auth-visual-caption">PRIVATE ACCESS · AUTHORISED STAFF ONLY</span>
      </section>
      <section className="auth-form-side">
        <Link className="auth-back" to="/">← Back to home</Link>
        <div className="auth-form-wrap">
          <span className="eyebrow"><span className="eyebrow-line" /> ADMINISTRATOR ACCESS</span>
          <h2>Sign in to your console.</h2>
          <p className="auth-subtitle">This sign-in is separate from customer accounts. Only the server can grant administrator access.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="admin-login-email">Administrator email</label>
            <input id="admin-login-email" className="form-control auth-input" name="email" type="email" autoComplete="username" placeholder="admin@example.com" value={form.email} onChange={handleChange} required />
            <label htmlFor="admin-login-password">Password</label>
            <input id="admin-login-password" className="form-control auth-input" name="password" type="password" autoComplete="current-password" placeholder="Administrator password" value={form.password} onChange={handleChange} required />
            <button className="button button-dark auth-submit" type="submit" disabled={loading}>{loading ? "Verifying access…" : "Open admin console"} <span>↗</span></button>
          </form>
          <p className="auth-switch"><Link to="/login">Return to customer sign in</Link></p>
          <div className="auth-small-note">Administrator access is checked on the server for every protected operation.</div>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;
