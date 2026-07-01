"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AuthProvider } from "@/lib/auth-context";
import { Stethoscope, LogIn, AlertCircle, Globe, Phone } from "lucide-react";
import Link from "next/link";

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const { setAuth } = useAuth();
  const router = useRouter();

  const t = lang === "ar" ? {
    title: "لاباس AI",
    subtitle: "لوحة تحكم الطبيب",
    phoneLabel: "رقم الجوال",
    passLabel: "كلمة المرور",
    loginBtn: "تسجيل الدخول",
    loggingIn: "جاري الدخول...",
    error: "بيانات غير صحيحة",
    registerLink: "ليس لديك حساب؟ سجل الآن",
  } : {
    title: "Labass AI",
    subtitle: "Doctor Dashboard",
    phoneLabel: "Phone Number",
    passLabel: "Password",
    loginBtn: "Sign In",
    loggingIn: "Signing in...",
    error: "Invalid credentials",
    registerLink: "Don't have an account? Register",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(phoneNumber, password);
      if (res.status === "authenticated") {
        setAuth({ token: res.token, deviceId: res.device_id, doctorName: res.doctor_name });
        router.push("/dashboard");
      } else {
        setError(t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="neu-button flex items-center gap-2 px-4 py-2 text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Globe size={16} />
            {lang === "en" ? "عربي" : "English"}
          </button>
        </div>

        <div className="neu-raised p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="neu-raised-sm p-4 mb-4">
              <Stethoscope size={32} style={{ color: "var(--color-primary)" }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
              {t.title}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
                <span className="flex items-center gap-1"><Phone size={14} />{t.phoneLabel}</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="966501234567"
                className="neu-inset w-full px-4 py-3 outline-none text-sm"
                style={{ color: "var(--color-text)", background: "var(--color-inset)" }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
                {t.passLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neu-inset w-full px-4 py-3 outline-none text-sm"
                style={{ color: "var(--color-text)", background: "var(--color-inset)" }}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#EF4444" }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="neu-button w-full py-3 flex items-center justify-center gap-2 font-semibold text-sm"
              style={{ color: "var(--color-primary)" }}
            >
              <LogIn size={18} />
              {loading ? t.loggingIn : t.loginBtn}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/register" className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
              {t.registerLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

