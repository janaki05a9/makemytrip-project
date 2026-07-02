import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function SeatSelection() {
  const router = useRouter();
  const { flightId, flightName } = router.query;
  const [seatData, setSeatData] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [savedSeats, setSavedSeats] = useState<any[]>([]);

  useEffect(() => {
    if (!flightId) return;
    fetch(`${BACKEND}/seats/${flightId}`)
      .then(r => r.json())
      .then(setSeatData);
    const saved = localStorage.getItem("savedSeats");
    if (saved) setSavedSeats(JSON.parse(saved));
  }, [flightId]);

  const getSeatColor = (seat: any) => {
    if (seat.booked) return "bg-gray-400 cursor-not-allowed";
    if (selectedSeat?.seatNumber === seat.seatNumber) return "bg-blue-500 text-white";
    if (seat.type === "Business") return "bg-yellow-100 hover:bg-yellow-300 cursor-pointer";
    if (seat.type === "Premium Economy") return "bg-green-100 hover:bg-green-300 cursor-pointer";
    return "bg-white hover:bg-blue-100 cursor-pointer border";
  };

  const bookSeat = async () => {
    if (!selectedSeat) return alert("Please select a seat first");
    await fetch(`${BACKEND}/seats/${flightId}/book?seatNumber=${selectedSeat.seatNumber}`, { method: "POST" });
    const newSaved = [...savedSeats, { flightId, flightName, seat: selectedSeat }];
    setSavedSeats(newSaved);
    localStorage.setItem("savedSeats", JSON.stringify(newSaved));
    alert(`✅ Seat ${selectedSeat.seatNumber} booked successfully!`);
    fetch(`${BACKEND}/seats/${flightId}`).then(r => r.json()).then(setSeatData);
    setSelectedSeat(null);
  };

  const rows = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-2">Select Your Seat</h1>
      <p className="text-gray-500 mb-6">Flight: {flightName}</p>

      {/* Legend */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-yellow-100 border rounded"></div><span className="text-sm">Business (₹2000)</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-green-100 border rounded"></div><span className="text-sm">Premium Economy (₹1000)</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-white border rounded"></div><span className="text-sm">Economy (₹500)</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded"></div><span className="text-sm">Booked</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-500 rounded"></div><span className="text-sm">Selected</span></div>
      </div>

      {/* Seat Map */}
      {seatData && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex gap-2 mb-4 justify-center">
            {rows.map(r => <div key={r} className="w-10 text-center text-xs font-bold text-gray-400">{r}</div>)}
          </div>
          {[1,2,3,4,5,6,7,8,9,10].map(rowNum => (
            <div key={rowNum} className="flex gap-2 mb-2 items-center justify-center">
              <span className="w-6 text-xs text-gray-400 text-right">{rowNum}</span>
              {rows.map(col => {
                const seat = seatData.seats?.find((s: any) => s.seatNumber === `${rowNum}${col}`);
                if (!seat) return null;
                return (
                  <div key={col}
                    onClick={() => !seat.booked && setSelectedSeat(seat)}
                    className={`w-10 h-10 rounded flex items-center justify-center text-xs font-medium ${getSeatColor(seat)}`}>
                    {seat.seatNumber}
                  </div>
                );
              })}
              {rowNum === 2 && <div className="w-8 text-center text-xs text-gray-300">✈</div>}
            </div>
          ))}
        </div>
      )}

      {/* Selected Seat Info */}
      {selectedSeat && (
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-blue-700 mb-1">Selected Seat: {selectedSeat.seatNumber}</h3>
          <p className="text-sm text-blue-600">Type: {selectedSeat.type}</p>
          <p className="text-sm text-blue-600">Price: ₹{selectedSeat.price}</p>
          <button onClick={bookSeat} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
            Confirm Seat
          </button>
        </div>
      )}

      {/* Saved Seats */}
      {savedSeats.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">💾 Saved Seat Preferences</h3>
          {savedSeats.map((s, i) => (
            <div key={i} className="flex justify-between text-sm border-b py-2">
              <span>{s.flightName} — Seat {s.seat.seatNumber}</span>
              <span className="text-gray-500">{s.seat.type} — ₹{s.seat.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}