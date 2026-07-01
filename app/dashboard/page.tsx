"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getStats } from "@/lib/api";
import { Users, CalendarDays, Clock, Activity, AlertCircle, RefreshCw } from "lucide-react";

export default function OverviewPage() {
  const { auth } = useAuth();
  const [stats, setStats] = useState<{ doctor_name: string; specialty: string; total_patients: number; total_bookings: number; pending_bookings: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = () => {
    if (!auth?.token) return;
    setLoading(true);
    setError("");
    getStats(auth.token)
      .then(setStats)
      .catch((e) => setError(e.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token]);

  const cards = stats ? [
    { icon: Users, label: "Total Patients", value: stats.total_patients, color: "var(--color-primary)" },
    { icon: CalendarDays, label: "Total Bookings", value: stats.total_bookings, color: "var(--color-accent)" },
    { icon: Clock, label: "Pending", value: stats.pending_bookings, color: "#EAB308" },
    { icon: Activity, label: "Specialty", value: stats.specialty, color: "#10B981" },
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          {loading ? "Loading..." : `Welcome, ${stats?.doctor_name}`}
        </h1>
        <button onClick={loadStats} className="neu-button p-2"><RefreshCw size={16} /></button>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>Dashboard Overview</p>

      {error && (
        <div className="neu-raised p-4 mb-4 flex items-center gap-3">
          <AlertCircle size={18} style={{ color: "#EF4444" }} />
          <p className="text-sm" style={{ color: "#EF4444" }}>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="neu-raised p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="neu-raised-sm p-3">
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{card.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

