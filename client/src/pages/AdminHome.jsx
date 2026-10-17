import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tab, setTab] = useState("bookings"); // which tab is open
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    roomNumber: "",
    name: "",
    description: "",
    imageUrl: "",
    type: "single",
    rent: "",
    count: 1,
  });

  // Fetch bookings, rooms and users from the backend
  const loadAll = () => {
    api.get("/bookings/all").then((r) => setBookings(r.data)).catch(() => {});
    api.get("/rooms/getrooms").then((r) => setRooms(r.data)).catch(() => {});
    api.get("/auth/users").then((r) => setUsers(r.data)).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRoom = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      await api.post("/rooms/addroom", {
        roomNumber: form.roomNumber.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type,
        rent: Number(form.rent),
        count: Number(form.count),
        photos: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      });
      setMessage({ text: "Room added successfully", type: "success" });
      setForm({ roomNumber: "", name: "", description: "", imageUrl: "", type: "single", rent: "", count: 1 });
      loadAll(); // refresh so the new room shows in All Rooms
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong",
        type: "danger",
      });
    }
  };

  const tabs = [
    { key: "bookings", label: "All Bookings" },
    { key: "rooms", label: "All Rooms" },
    { key: "add", label: "Add Room" },
    { key: "users", label: "All Users" },
  ];

  return (
    <>
      <nav className="hotel-nav admin-nav">
        <span className="hotel-brand"><span className="brand-mark">H</span><span>hotel<span className="brand-light">pro</span><small>ADMIN CONSOLE</small></span></span>
        <div className="hotel-nav-actions">
          <span className="nav-login">Signed in as {user?.name || "Admin"}</span>
          <button className="button button-dark" onClick={logout}>Log out <span>↗</span></button>
        </div>
      </nav>

      <div className="admin-container">
        <header className="admin-heading">
          <span className="eyebrow"><span className="eyebrow-line" /> HOTEL MANAGEMENT</span>
          <h1>Good operations make great stays.</h1>
          <p>Review reservations, manage room inventory and keep your guest information organised.</p>
        </header>
        <ul className="admin-tabs">
          {tabs.map((t) => (
            <li className="nav-item" key={t.key}>
              <button
                className={`nav-link ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        {tab === "bookings" && (
          <div className="table-responsive admin-table-panel">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Contact</th>
                  <th>Room</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.guestName}</td>
                    <td>
                      {b.user?.email}
                      <br />
                      {b.user?.phone}
                    </td>
                    <td className="text-capitalize">
                      {b.room?.type} #{b.room?.roomNumber}
                    </td>
                    <td>{new Date(b.fromdate).toLocaleDateString()}</td>
                    <td>{new Date(b.todate).toLocaleDateString()}</td>
                    <td>Rs {b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.status === "booked" ? "bg-success" : "bg-secondary"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <p className="text-muted">No bookings yet.</p>}
          </div>
        )}

        {tab === "rooms" && (
          <div className="table-responsive admin-table-panel">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Rent</th>
                  <th>Units</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td>{r.roomNumber}</td>
                    <td>{r.name || "—"}</td>
                    <td className="text-capitalize">{r.type}</td>
                    <td>{r.description}</td>
                    <td>Rs {r.rent}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "add" && (
          <div style={{ maxWidth: 480 }}>
            {message.text && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}
            <form onSubmit={addRoom}>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>Add a room</h2>
              <p style={{ color: "#77786f", fontSize: 12, lineHeight: 1.7 }}>Create a room listing. Guests will see its name, description, nightly price and photo.</p>
              <label htmlFor="room-number">Room number / unique ID</label>
              <input id="room-number" className="form-control mb-3" name="roomNumber" placeholder="e.g. 401" value={form.roomNumber} onChange={handleChange} required maxLength={30} />
              <label htmlFor="room-name">Display name</label>
              <input id="room-name" className="form-control mb-3" name="name" placeholder="e.g. Garden View Deluxe" value={form.name} onChange={handleChange} maxLength={80} />
              <label htmlFor="room-description">Description</label>
              <textarea id="room-description" className="form-control mb-3" name="description" placeholder="Describe the room, bed setup, amenities and what makes it special..." value={form.description} onChange={handleChange} required rows={4} maxLength={1200} />
              <label htmlFor="room-photo">Photo URL (optional)</label>
              <input id="room-photo" className="form-control mb-3" name="imageUrl" type="url" placeholder="https://example.com/room-photo.jpg" value={form.imageUrl} onChange={handleChange} />
              <label htmlFor="room-type-admin">Room type</label>
              <select id="room-type-admin" className="form-select mb-3" name="type" value={form.type} onChange={handleChange}>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
              <label htmlFor="room-rent">Nightly price (₹)</label>
              <input id="room-rent" className="form-control mb-3" name="rent" type="number" min="1" step="1" placeholder="Rent per night" value={form.rent} onChange={handleChange} required />
              <label htmlFor="room-count">Number of available units</label>
              <input id="room-count" className="form-control mb-3" name="count" type="number" min="1" step="1" placeholder="e.g. 1" value={form.count} onChange={handleChange} required />
              <button className="btn btn-primary" type="submit">Save room listing</button>
            </form>
          </div>
        )}

        {tab === "users" && (
          <div className="table-responsive admin-table-panel">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td className="text-capitalize">{u.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminHome;