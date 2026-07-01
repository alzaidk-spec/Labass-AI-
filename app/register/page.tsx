"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerDoctor } from "@/lib/api";
import { UserPlus, Stethoscope, Globe, AlertCircle, CheckCircle, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ doctor_name: "", specialty: "", phone_number: "", password: "" });
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ device_id: string } | null>(null);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const router = useRouter();

  const t = lang === "ar" ? {
    title: "\u062a\u0633\u062c\u064a\u0644 \u062c\u062f\u064a\u062f",
    subtitle: "\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u0643 \u0644\u0628\u062f\u0621 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0644\u0627\u0628\u0627\u0633 AI",
    nameLabel: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0628\u064a\u0628",
    specLabel: "\u0627\u0644\u062a\u062e\u0635\u0635",
    phoneLabel: "\u0631\u0642\u0645 \u0627\u0644\u062c\u0648\u0627\u0644",
    passLabel: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    confirmLabel: "\u062a\u0623\u0643\u064a\u062f \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    registerBtn: "\u062a\u0633\u062c\u064a\u0644",
    registering: "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u0633\u062c\u064a\u0644...",
    mismatch: "\u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0645\u062a\u0637\u0627\u0628\u0642\u0629",
    loginLink: "\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f \u0633\u062c\u0644 \u062f\u062e\u0648\u0644",
    successTitle: "\u062a\u0645 \u0627\u0644\u062a\u0633\u062c\u064a\u0644!",
    deviceNote: "\u0645\u0639\u0631\u0641 \u062c\u0647\u0627\u0632\u0643:",
    saveNote: "\u0627\u062d\u0641\u0638 \u0647\u0630\u0627 \u0627\u0644\u0645\u0639\u0631\u0641 \u0644\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    goLogin: "\u0627\u0630\u0647\u0628 \u0644\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
  } : {
    title: "Create Account",
    subtitle: "Register to start using Labass AI",
    nameLabel: "Doctor Name",
    specLabel: "Specialty",
    phoneLabel: "Phone Number",
    passLabel: "Password",
    confirmLabel: "Confirm Password",
    registerBtn: "Create Account",
    registering: "Creating...",
    mismatch: "Passwords don't match",
    loginLink: "Already have an account? Sign in",
    successTitle: "Account Created!",
    deviceNote: "Your Device ID:",
    saveNote: "Save this ID to log in to the dashboard",
    goLogin: "Go to Login",
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== confirmPw) {
      setError(t.mismatch);
      return;
    }
    setLoading(true);
    try {
      const res = await registerDoctor(form);
      if (res.status === "registered") {
        setSuccess({ device_id: res.device_id });
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md">
        {/* Language toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="neu-button flex items-center gap-2 px-4 py-2 text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Globe size={16} />
            {lang === "en" ? "\u0639\u0631\u0628\u064a" : "English"}
          </button>
        </div>

        <div className="neu-raised p-8">
          {/* Success state */}
          {success ? (
            <div className="text-center">
              <div className="neu-raised-sm p-4 inline-block mb-4">
                <CheckCircle size={32} style={{ color: "#10B981" }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>{t.successTitle}</h2>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>{t.deviceNote}</p>
              <div className="neu-inset px-4 py-3 mb-3 text-center">
                <code className="text-sm font-mono font-bold" style={{ color: "var(--color-primary)" }}>
                  {success.device_id}
                </code>
              </div>
              <p className="text-xs mb-6" style={{ color: "var(--color-accent)" }}>{t.saveNote}</p>
              <button
                onClick={() => router.push("/")}
                className="neu-button w-full py-3 font-semibold text-sm flex items-center justify-center gap-2"
                style={{ color: "var(--color-primary)" }}
              >
                <ArrowLeft size={16} />{t.goLogin}
              </button>
            </div>
          ) : (
            /* Registration form */
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="neu-raised-sm p-4 mb-4">
                  <Stethoscope size={32} style={{ color: "var(--color-primary)" }} />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>{t.title}</h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>{t.subtitle}</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>{t.nameLabel}</label>
                  <input type="text" value={form.doctor_name} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
                    className="neu-inset w-full px-4 py-3 outline-none text-sm" style={{ color: "var(--color-text)", background: "var(--color-inset)" }} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>{t.specLabel}</label>
                  <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    placeholder={lang === "ar" ? "\u0637\u0628 \u0639\u0627\u0645" : "e.g., Internal Medicine"}
                    className="neu-inset w-full px-4 py-3 outline-none text-sm" style={{ color: "var(--color-text)", background: "var(--color-inset)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
                    <span className="flex items-center gap-1"><Phone size={14} />{t.phoneLabel}</span>
                  </label>
                  <input type="tel" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    placeholder="966501234567"
                    className="neu-inset w-full px-4 py-3 outline-none text-sm" style={{ color: "var(--color-text)", background: "var(--color-inset)" }} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>{t.passLabel}</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="neu-inset w-full px-4 py-3 outline-none text-sm" style={{ color: "var(--color-text)", background: "var(--color-inset)" }} required minLength={4} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>{t.confirmLabel}</label>
                  <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                    className="neu-inset w-full px-4 py-3 outline-none text-sm" style={{ color: "var(--color-text)", background: "var(--color-inset)" }} required minLength={4} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#EF4444" }}>
                    <AlertCircle size={16} />{error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="neu-button w-full py-3 flex items-center justify-center gap-2 font-semibold text-sm"
                  style={{ color: "var(--color-primary)" }}>
                  <UserPlus size={18} />{loading ? t.registering : t.registerBtn}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link href="/" className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                  {t.loginLink}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

