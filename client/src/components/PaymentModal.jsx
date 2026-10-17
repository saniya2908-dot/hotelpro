import { useState } from "react";

function BookingModal({ room, fromdate, todate, onClose, onConfirm }) {
  const [saving, setSaving] = useState(false);
  const nights = Math.round((new Date(`${todate}T00:00:00Z`) - new Date(`${fromdate}T00:00:00Z`)) / 86400000);
  const total = nights * Number(room.rent);

  const confirm = async () => {
    setSaving(true);
    await onConfirm();
    setSaving(false);
  };

  return (
    <div className="modal d-block" role="presentation" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5" id="booking-title">Review your stay</h2>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={saving}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-warning py-2">Online payments are not enabled. This demo will create a booking without charging you.</div>
            <p className="mb-2"><strong className="text-capitalize">{room.type} room #{room.roomNumber}</strong></p>
            <p className="mb-0">{fromdate} to {todate}<br />{nights} night(s) × ₹{Number(room.rent).toLocaleString("en-IN")} = <strong>₹{total.toLocaleString("en-IN")}</strong></p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Back</button>
            <button type="button" className="btn btn-primary" onClick={confirm} disabled={saving}>{saving ? "Creating booking…" : "Confirm booking"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
