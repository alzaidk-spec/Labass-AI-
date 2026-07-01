"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getPatients } from "@/lib/api";
import { Users, Search, Phone, AlertCircle, RefreshCw, User } from "lucide-react";

interface Patient {
  phone: string;
  phone_raw: string;
  name?: string;
}

export default function PatientsPage() {
  const { auth } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = () => {
    if (!auth?.token) return;
    setLoading(true);
    setError("");
    getPatients(auth.token)
      .then((r) => {
        setPatients(r.patients || []);
      })
      .catch((e) => {
        setError(e.message || "Failed to load patients");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPatients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token]);

  const filtered = patients.filter(
    (p) => p.phone.includes(search) || (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Patients</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{patients.length} total</p>
        </div>
        <button onClick={loadPatients} className="neu-raised-sm p-3 cursor-pointer">
          <RefreshCw size={20} style={{ color: "var(--color-primary)" }} />
        </button>
      </div>

      <div className="neu-inset flex items-center gap-2 px-4 py-3 mb-6">
        <Search size={16} style={{ color: "var(--color-text-muted)" }} />
        <input type="text" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none flex-1 text-sm" style={{ color: "var(--color-text)" }} />
      </div>

      {error && (
        <div className="neu-raised p-4 mb-4 flex items-center gap-3">
          <AlertCircle size={18} style={{ color: "#EF4444" }} />
          <p className="text-sm" style={{ color: "#EF4444" }}>{error}</p>
          <button onClick={loadPatients} className="neu-button p-2 ml-auto"><RefreshCw size={14} /></button>
        </div>
      )}

      {loading ? (
        <p className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>Loading patients...</p>
      ) : filtered.length === 0 && !error ? (
        <div className="neu-raised p-8 text-center">
          <Users size={32} className="mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
          <p style={{ color: "var(--color-text-muted)" }}>No patients found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <div key={i} className="neu-raised p-4 flex items-center gap-4">
              <div className="neu-raised-sm p-2">
                {p.name ? (
                  <User size={16} style={{ color: "var(--color-primary)" }} />
                ) : (
                  <Phone size={16} style={{ color: "var(--color-text-muted)" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {p.name ? (
                  <>
                    <p className="font-medium text-sm truncate" style={{ color: "var(--color-text)" }}>{p.name}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)", direction: "ltr" }}>+{p.phone}</p>
                  </>
                ) : (
                  <p className="font-medium text-sm" style={{ color: "var(--color-text)", direction: "ltr" }}>+{p.phone}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

