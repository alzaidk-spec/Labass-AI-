"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { getProfile, updateProfile, getWhatsAppQR, getWhatsAppStatus } from "@/lib/api";
import { Settings, Save, CheckCircle, Smartphone, QrCode, Wifi, WifiOff, RefreshCw, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { auth } = useAuth();
  const [form, setForm] = useState({ doctor_name: "", specialty: "", services: "", working_hours: "", assistant_number: "", location: "", booking_window_minutes: "30", reminder_minutes: "180,60", escalation_number: "", services_prices: "", post_appointment_delay: "60", telemedicine_promo: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // WhatsApp state
  const [waConnected, setWaConnected] = useState(false);
  const [waPhone, setWaPhone] = useState("");
  const [waName, setWaName] = useState("");
  const [qrLink, setQrLink] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const checkWaStatus = useCallback(async () => {
    if (!auth?.token) return;
    setStatusLoading(true);
    try {
      const res = await getWhatsAppStatus(auth.token);
      setWaConnected(res.connected);
      setWaPhone(res.phone_jid?.replace("@s.whatsapp.net", "") || "");
      setWaName(res.display_name || "");
    } catch { /* ignore */ }
    setStatusLoading(false);
  }, [auth?.token]);

  useEffect(() => {
    if (!auth?.token) return;
    getProfile(auth.token).then((r) => {
      setForm({ doctor_name: r.doctor_name || "", specialty: r.specialty || "", services: r.services || "", working_hours: r.working_hours || "", assistant_number: r.assistant_number || "", location: r.location || "", booking_window_minutes: String(r.booking_window_minutes ?? 30), reminder_minutes: r.reminder_minutes || "180,60", escalation_number: r.escalation_number || "", services_prices: r.services_prices || "", post_appointment_delay: String(r.post_appointment_delay ?? 60), telemedicine_promo: r.telemedicine_promo || "" });
    }).catch(console.error).finally(() => setLoading(false));
    checkWaStatus();
  }, [auth?.token, checkWaStatus]);

  const handleSave = async () => {
    if (!auth?.token) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile(auth.token, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!auth?.token) return;
    setQrLoading(true);
    setQrLink("");
    try {
      const res = await getWhatsAppQR(auth.token);
      if (res.qr_link) {
        setQrLink(res.qr_link);
      }
    } catch (e) {
      console.error(e);
    }
    setQrLoading(false);
  };

  const fields = [
    { key: "doctor_name", label: "Doctor Name" },
    { key: "specialty", label: "Specialty" },
    { key: "services", label: "Services (comma-separated)" },
    { key: "working_hours", label: "Working Hours" },
    { key: "assistant_number", label: "Booking Forwarding Number (no +)" },
    { key: "location", label: "Clinic Location / Address" },
    { key: "booking_window_minutes", label: "Booking Conflict Window (minutes)" },
    { key: "reminder_minutes", label: "Reminder Times (minutes before, comma-separated)" },
    { key: "escalation_number", label: "Escalation Number (forward unanswered Qs, no +)" },
    { key: "post_appointment_delay", label: "Post-Appointment Thank-You Delay (minutes)" },
  ] as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Settings</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Manage your profile & WhatsApp</p>
        </div>
        <div className="neu-raised-sm p-3"><Settings size={20} style={{ color: "var(--color-text-muted)" }} /></div>
      </div>

      {/* WhatsApp Connection Section */}
      <div className="neu-raised p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="neu-raised-sm p-2">
            <Smartphone size={18} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>WhatsApp Connection</h2>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Connect your WhatsApp to receive patient messages</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="neu-inset p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {waConnected ? (
              <Wifi size={18} style={{ color: "#10B981" }} />
            ) : (
              <WifiOff size={18} style={{ color: "#EF4444" }} />
            )}
            <div>
              <p className="text-sm font-medium" style={{ color: waConnected ? "#10B981" : "#EF4444" }}>
                {waConnected ? "Connected" : "Not Connected"}
              </p>
              {waConnected && waPhone && (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  +{waPhone} {waName ? `(${waName})` : ""}
                </p>
              )}
            </div>
          </div>
          <button onClick={checkWaStatus} disabled={statusLoading}
            className="neu-button p-2" title="Refresh status">
            {statusLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          </button>
        </div>

        {/* QR Code Section */}
        {!waConnected && (
          <div>
            {!qrLink ? (
              <button onClick={handleGenerateQR} disabled={qrLoading}
                className="neu-button px-5 py-3 flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--color-primary)" }}>
                {qrLoading ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                {qrLoading ? "Generating QR..." : "Connect WhatsApp"}
              </button>
            ) : (
              <div className="text-center">
                <div className="neu-raised p-4 inline-block mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrLink} alt="WhatsApp QR Code" width={256} height={256} className="rounded-lg" />
                </div>
                <p className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Open WhatsApp &rarr; Settings &rarr; Linked Devices &rarr; Link a Device
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--color-accent)" }}>
                  QR expires in 30 seconds
                </p>
                <div className="flex gap-2 justify-center">
                  <button onClick={handleGenerateQR} disabled={qrLoading}
                    className="neu-button px-4 py-2 flex items-center gap-2 text-xs font-medium"
                    style={{ color: "var(--color-text-muted)" }}>
                    <RefreshCw size={14} />New QR
                  </button>
                  <button onClick={checkWaStatus}
                    className="neu-button px-4 py-2 flex items-center gap-2 text-xs font-medium"
                    style={{ color: "var(--color-primary)" }}>
                    <CheckCircle size={14} />I scanned it
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Section */}
      {loading ? (
        <p className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>Loading...</p>
      ) : (
        <div className="neu-raised p-6 space-y-5">
          <h2 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>Doctor Profile</h2>
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>{f.label}</label>
              <input
                type="text"
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="neu-inset w-full px-4 py-3 outline-none text-sm"
                style={{ color: "var(--color-text)", background: "var(--color-inset)" }}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>Telemedicine Promo Text (sent after appointments)</label>
            <textarea
              value={form.telemedicine_promo}
              onChange={(e) => setForm({ ...form, telemedicine_promo: e.target.value })}
              rows={3}
              placeholder="Subscribe to Labass Telemedicine for remote consultations with your doctor anytime during the month."
              className="neu-inset w-full px-4 py-3 outline-none text-sm resize-none"
              style={{ color: "var(--color-text)", background: "var(--color-inset)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>Services & Prices (one per line: Service - Price)</label>
            <textarea
              value={form.services_prices}
              onChange={(e) => setForm({ ...form, services_prices: e.target.value })}
              rows={5}
              placeholder={"General Consultation - 200 SAR\nDiabetes Follow-up - 150 SAR\nBlood Test - 100 SAR"}
              className="neu-inset w-full px-4 py-3 outline-none text-sm resize-none"
              style={{ color: "var(--color-text)", background: "var(--color-inset)" }}
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="neu-button px-6 py-3 flex items-center gap-2 font-semibold text-sm"
              style={{ color: "var(--color-primary)" }}>
              <Save size={16} />{saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm" style={{ color: "#10B981" }}>
                <CheckCircle size={16} />Saved!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

















