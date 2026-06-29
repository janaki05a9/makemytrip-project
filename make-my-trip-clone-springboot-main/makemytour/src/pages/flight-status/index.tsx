import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function FlightStatus() {
  const router = useRouter();
  const [trackedFlights, setTrackedFlights] = useState<any[]>([]);
  const [flightId, setFlightId] = useState("");
  const [flightName, setFlightName] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    if (status === "On Time") return "bg-green-100 text-green-700";
    if (status === "Delayed") return "bg-red-100 text-red-700";
    if (status === "Boarding") return "bg-blue-100 text-blue-700";
    if (status === "Departed") return "bg-purple-100 text-purple-700";
    if (status === "Landed") return "bg-gray-100 text-gray-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const trackFlight = async () => {
    if (!flightId || !flightName) return alert("Enter flight ID and name");
    const res = await fetch(`${BACKEND}/flight-status/${flightId}?flightName=${flightName}`);
    const data = await res.json();
    const exists = trackedFlights.find(f => f.flightId === flightId);
    if (!exists) {
      setTrackedFlights(prev => [...prev, data]);
      setNotifications(prev => [`✈️ Now tracking ${flightName} — Status: ${data.status}`, ...prev]);
    } else {
      alert("Flight already being tracked!");
    }
    setFlightId("");
    setFlightName("");
  };

  const refreshStatus = async (fId: string, fName: string) => {
    const res = await fetch(`${BACKEND}/flight-status/${fId}?flightName=${fName}`);
    const data = await res.json();
    setTrackedFlights(prev => prev.map(f => f.flightId === fId ? data : f));
    setNotifications(prev => [`🔔 ${fName} status updated: ${data.status}${data.delayMinutes > 0 ? ` — Delayed by ${data.delayMinutes} mins` : ""}`, ...prev]);
  };

  const removeFlight = (fId: string) => {
    setTrackedFlights(prev => prev.filter(f => f.flightId !== fId));
  };

  useEffect(() => {
    if (trackedFlights.length === 0) return;
    const interval = setInterval(() => {
      trackedFlights.forEach(f => refreshStatus(f.flightId, f.flightName));
    }, 30000);
    return () => clearInterval(interval);
  }, [trackedFlights]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">✈️ Live Flight Status</h1>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-blue-700 mb-2">🔔 Notifications</h2>
          {notifications.slice(0, 5).map((n, i) => (
            <p key={i} className="text-sm text-blue-600 mb-1">{n}</p>
          ))}
        </div>
      )}

      {/* Track Flight Form */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="font-semibold mb-3">Track a Flight</h2>
        <div className="flex gap-3 flex-wrap">
          <input value={flightId} onChange={e => setFlightId(e.target.value)}
            placeholder="Flight ID" className="border rounded-lg px-3 py-2 text-sm flex-1" />
          <input value={flightName} onChange={e => setFlightName(e.target.value)}
            placeholder="Flight Name (e.g. IndiGo)" className="border rounded-lg px-3 py-2 text-sm flex-1" />
          <button onClick={trackFlight}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
            Track Flight
          </button>
        </div>
      </div>

      {/* Tracked Flights */}
      {trackedFlights.length === 0 && (
        <p className="text-gray-400 text-center">No flights being tracked. Add a flight above.</p>
      )}

      {trackedFlights.map((f, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-5 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{f.flightName}</h3>
              <p className="text-xs text-gray-400">ID: {f.flightId}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(f.status)}`}>
              {f.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <p className="text-gray-400">Original Departure</p>
              <p className="font-medium">{f.originalDeparture}</p>
            </div>
            <div>
              <p className="text-gray-400">Revised Departure</p>
              <p className="font-medium">{f.revisedDeparture}</p>
            </div>
            <div>
              <p className="text-gray-400">Estimated Arrival</p>
              <p className="font-medium">{f.estimatedArrival}</p>
            </div>
            <div>
              <p className="text-gray-400">Gate</p>
              <p className="font-medium">{f.gate}</p>
            </div>
          </div>

          {f.delayMinutes > 0 && (
            <div className="bg-red-50 rounded-lg p-3 mb-3">
              <p className="text-red-600 text-sm font-semibold">
                ⚠️ Delayed by {f.delayMinutes} minutes
              </p>
              <p className="text-red-500 text-xs">Reason: {f.delayReason}</p>
            </div>
          )}

          <p className="text-xs text-gray-400 mb-3">
            Last updated: {f.lastUpdated?.slice(0, 19)}
          </p>

          <div className="flex gap-3">
            <button onClick={() => refreshStatus(f.flightId, f.flightName)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium">
              🔄 Refresh Status
            </button>
            <button onClick={() => removeFlight(f.flightId)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-medium">
              ✕ Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}