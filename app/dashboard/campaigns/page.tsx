"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { sendCampaign } from "@/lib/api";
import { MessageCircle, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function CampaignsPage() {
  const { auth } = useAuth();
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; messages_sent: number } | null>(null);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!auth?.token || !context.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await sendCampaign(auth.token, context);
      setResult(res);
      setContext("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Campaigns</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Send promotional messages to your patients</p>
        </div>
        <div className="neu-raised-sm p-3"><MessageCircle size={20} style={{ color: "var(--color-accent)" }} /></div>
      </div>

      <div className="neu-raised p-6">
        <label className="block text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>Campaign Message</label>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
          Describe what you want to promote. The AI will craft a personalized message for each patient.
        </p>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="e.g., Monthly health check package at 199 SAR, includes blood test and consultation..."
          className="neu-inset w-full px-4 py-3 outline-none text-sm resize-none"
          style={{ color: "var(--color-text)", background: "var(--color-inset)" }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !context.trim()}
          className="neu-button mt-4 px-6 py-3 flex items-center gap-2 font-semibold text-sm"
          style={{ color: loading ? "var(--color-text-muted)" : "var(--color-primary)" }}
        >
          <Send size={16} />
          {loading ? "Sending..." : "Send Campaign"}
        </button>
      </div>

      {result && (
        <div className="neu-raised p-5 mt-4 flex items-center gap-3">
          <CheckCircle size={20} style={{ color: "#10B981" }} />
          <div>
            <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>Campaign sent!</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{result.messages_sent} messages delivered</p>
          </div>
        </div>
      )}

      {error && (
        <div className="neu-raised p-5 mt-4 flex items-center gap-3">
          <AlertCircle size={20} style={{ color: "#EF4444" }} />
          <p className="text-sm" style={{ color: "#EF4444" }}>{error}</p>
        </div>
      )}
    </div>
  );
}

