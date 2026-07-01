"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LayoutDashboard, Users, CalendarDays, MessageCircle, Settings, LogOut, Globe, Stethoscope, Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_EN = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/patients", icon: Users, label: "Patients" },
  { href: "/dashboard/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/dashboard/campaigns", icon: MessageCircle, label: "Campaigns" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const NAV_AR = [
  { href: "/dashboard", icon: LayoutDashboard, label: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629" },
  { href: "/dashboard/patients", icon: Users, label: "\u0627\u0644\u0645\u0631\u0636\u0649" },
  { href: "/dashboard/bookings", icon: CalendarDays, label: "\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a" },
  { href: "/dashboard/campaigns", icon: MessageCircle, label: "\u0627\u0644\u062d\u0645\u0644\u0627\u062a" },
  { href: "/dashboard/settings", icon: Settings, label: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a" },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { auth, logout, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = lang === "ar" ? NAV_AR : NAV_EN;

  useEffect(() => {
    if (!isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen flex" style={{ background: "var(--color-bg)" }}>
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-64 p-4 gap-2">
        <div className="neu-raised p-4 mb-4 flex items-center gap-3">
          <div className="neu-raised-sm p-2"><Stethoscope size={20} style={{ color: "var(--color-primary)" }} /></div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{auth?.doctorName}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Labass AI</p>
          </div>
        </div>
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${active ? "neu-inset" : "neu-button"}`}
              style={{ color: active ? "var(--color-primary)" : "var(--color-text-muted)" }}
            >
              <item.icon size={18} />{item.label}
            </Link>
          );
        })}
        <div className="mt-auto flex flex-col gap-2">
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="neu-button flex items-center gap-2 px-4 py-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
            <Globe size={16} />{lang === "en" ? "\u0639\u0631\u0628\u064a" : "English"}
          </button>
          <button onClick={handleLogout} className="neu-button flex items-center gap-2 px-4 py-3 text-sm" style={{ color: "#EF4444" }}>
            <LogOut size={16} />{lang === "ar" ? "\u062e\u0631\u0648\u062c" : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-3 flex items-center justify-between" style={{ background: "var(--color-bg)" }}>
        <div className="flex items-center gap-2">
          <Stethoscope size={20} style={{ color: "var(--color-primary)" }} />
          <span className="font-bold text-sm">{auth?.doctorName}</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="neu-button p-2">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 p-4 pt-16 flex flex-col gap-2" style={{ background: "var(--color-bg)" }}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${pathname === item.href ? "neu-inset" : "neu-button"}`}
              style={{ color: pathname === item.href ? "var(--color-primary)" : "var(--color-text-muted)" }}
            >
              <item.icon size={18} />{item.label}
            </Link>
          ))}
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="neu-button flex items-center gap-2 px-4 py-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
            <Globe size={16} />{lang === "en" ? "\u0639\u0631\u0628\u064a" : "English"}
          </button>
          <button onClick={handleLogout} className="neu-button flex items-center gap-2 px-4 py-3 text-sm" style={{ color: "#EF4444" }}>
            <LogOut size={16} />{lang === "ar" ? "\u062e\u0631\u0648\u062c" : "Logout"}
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 overflow-auto">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><DashboardShell>{children}</DashboardShell></AuthProvider>;
}

