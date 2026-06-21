import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const REASONS = ["Change of plans", "Found a better price", "Emergency", "Other"];

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [refundInfo, setRefundInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { router.push("/"); return; }
    fetch(`${BACKEND}/booking/user/${userId}`)
      .then(r => r.json())
      .then(setBookings);
  }, []);

  const openModal = (b: any) => { setSelected(b); setModal(true); setRefundInfo(null); };
  const closeModal = () => { setModal(false); setSelected(null); };

  const confirm = async () => {
    if (!reason) return alert("Select a reason");
    const userId = localStorage.getItem("userId");
    const res = await fetch(`${BACKEND}/booking/cancel?userId=${userId}&bookingId=${selected.bookingId}&reason=${reason}`, { method: "POST" });
    const data = await res.json();
    setRefundInfo(data);
    setBookings(prev => prev.map(b => b.bookingId === selected.bookingId ? { ...b, bookingStatus: "cancelled", refundAmount: data.refundAmount, refundStatus: "pending" } : b));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.map((b, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{b.type} — {b.bookingId}</p>
              <p className="text-sm text-gray-500">Date: {b.date} | ₹{b.totalPrice}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.bookingStatus === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {b.bookingStatus?.toUpperCase()}
            </span>
          </div>

          {b.bookingStatus === "cancelled" && (
            <div className="mt-3 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-blue-700">Refund: ₹{b.refundAmount}</p>
              <p className="text-xs text-gray-500">Status: {b.refundStatus} → processed → completed</p>
              <p className="text-xs text-gray-400">Expected in 5-7 business days</p>
            </div>
          )}

          {b.bookingStatus === "confirmed" && (
            <button onClick={() => openModal(b)} className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm">
              Cancel Booking
            </button>
          )}
        </div>
      ))}

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96">
            {!refundInfo ? (
              <>
                <h2 className="text-lg font-bold mb-3">Cancel Booking</h2>
                <select value={reason} onChange={e => setReason(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4 text-sm">
                  <option value="">-- Select reason --</option>
                  {REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
                <p className="text-xs text-gray-400 mb-4">Within 24hrs = 50% refund. After that = no refund.</p>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 border rounded-lg py-2 text-sm">Go Back</button>
                  <button onClick={confirm} className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-semibold">Confirm Cancel</button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-4xl mb-3">✅</p>
                <p className="font-bold text-lg mb-1">Booking Cancelled!</p>
                <p className="text-blue-600 text-sm mb-4">{refundInfo.refundMessage}</p>
                <button onClick={closeModal} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}