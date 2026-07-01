"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getBookings } from "@/lib/api";
import { CalendarDays, User, Clock, Stethoscope, AlertCircle, RefreshCw } from "lucide-react";

type Booking = {
  patient_name: string;
  patient_phone_clean: string;
  specialty_doctor: string;
  requested_time: string;
  created_at: string;
  status: string;
};

export default function BookingsPage() {
  const { auth } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = () => {
    if (!auth?.token) return;
    setLoading(true);
    setError("");
    getBookings(auth.token)
      .then((r) => {
        setBookings(r.bookings || []);
      })
      .catch((e) => {
        setError(e.message || "Failed to load bookings");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Bookings</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{bookings.length} total</p>
        </div>
        <button onClick={loadBookings} className="neu-raised-sm p-3 cursor-pointer">
          <CalendarDays size={20} style={{ color: "var(--color-accent)" }} />
        </button>
      </div>

      {error && (
        <div className="neu-raised p-4 mb-4 flex items-center gap-3">
          <AlertCircle size={18} style={{ color: "#EF4444" }} />
          <p className="text-sm" style={{ color: "#EF4444" }}>{error}</p>
          <button onClick={loadBookings} className="neu-button p-2 ml-auto"><RefreshCw size={14} /></button>
        </div>
      )}

      {loading ? (
        <p className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>Loading bookings...</p>
      ) : bookings.length === 0 && !error ? (
        <div className="neu-raised p-8 text-center">
          <CalendarDays size={32} className="mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
          <p style={{ color: "var(--color-text-muted)" }}>No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((bk, i) => (
            <div key={i} className="neu-raised p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="neu-raised-sm p-2"><User size={16} style={{ color: "var(--color-primary)" }} /></div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{bk.patient_name}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>+{bk.patient_phone_clean}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  bk.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : bk.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {bk.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <span className="flex items-center gap-1"><Stethoscope size={13} />{bk.specialty_doctor || "N/A"}</span>
                <span className="flex items-center gap-1"><Clock size={13} />{bk.requested_time}</span>
                <span className="flex items-center gap-1"><CalendarDays size={13} />{new Date(bk.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

